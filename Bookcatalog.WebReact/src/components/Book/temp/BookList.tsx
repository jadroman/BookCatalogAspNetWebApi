import { useEffect, useMemo, useState } from 'react';
import { object, string, number } from 'yup';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
  MRT_Row,
  MRT_TableOptions,
  createRow,
} from 'material-react-table';
import { getApiUrl } from 'config/url';
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'; //note: this is TanStack React Query V5
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategorySelection from 'components/Category/CategorySelection';
import { EmojiEvents, Close } from '@mui/icons-material';
import { Book } from 'types/book';
import { Category } from 'types/category';
import { ApiData, ApiResponse } from 'types/shared';

enum EditStatus { 'update', 'insert' };

const BookList = () => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('0');
  const [selectedBookId, setSelectedBookId] = useState<string>('0');
  const [disableSaveOnInsert, setDisableSaveOnInsert] = useState<boolean>(false);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([],);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: { items = [], metaData } = {},
    isError: isLoadingBooksError,
    isRefetching: isRefetchingBooks,
    isLoading: isLoadingBooks,
    refetch: refetchBook,
  } = useGetBooks();

  function useGetBooks() {
    return useQuery<ApiData<Book>>({
      queryKey: [
        'bookData',
        columnFilters, //refetch when columnFilters changes
        globalFilter, //refetch when globalFilter changes
        pagination.pageIndex, //refetch when pagination.pageIndex changes
        pagination.pageSize, //refetch when pagination.pageSize changes
        sorting, //refetch when sorting changes
      ],
      queryFn: async () => {
        const getBooksUrl = new URL(
          'book', getApiUrl(),
        );

        // URL e.g. api/book?PageNumber=0&pageSize=10&title=long&author=nick&globalFilter=&OrderBy=author+asc

        getBooksUrl.searchParams.set('pageNumber', `${pagination.pageIndex}`);
        getBooksUrl.searchParams.set('pageSize', `${pagination.pageSize}`);

        columnFilters.forEach((cf) => {
          if (cf.id === 'title') {
            if (cf.value !== '' && typeof cf.value === 'string') {
              getBooksUrl.searchParams.set('title', cf.value)
            }
          }
          else if (cf.id === 'author') {
            if (cf.value !== '' && typeof cf.value === 'string') {
              getBooksUrl.searchParams.set('author', cf.value)
            }
          }
          else if (cf.id === 'category.name') {
            if (cf.value !== '' && typeof cf.value === 'string') {
              getBooksUrl.searchParams.set('category', cf.value)
            }
          }
          else if (cf.id === 'note') {
            if (cf.value !== '' && typeof cf.value === 'string') {
              getBooksUrl.searchParams.set('note', cf.value)
            }
          }
          else if (cf.id === 'publisher') {
            if (cf.value !== '' && typeof cf.value === 'string') {
              getBooksUrl.searchParams.set('publisher', cf.value)
            }
          }
          else if (cf.id === 'collection') {
            if (cf.value !== '' && typeof cf.value === 'string') {
              getBooksUrl.searchParams.set('collection', cf.value)
            }
          }
        })

        if (sorting && sorting.length > 0) {
          let showDescAsc = sorting[0].desc ? "desc" : "asc";
          getBooksUrl.searchParams.set('orderBy', `${sorting[0].id}` + " " + showDescAsc);
        }

        const response = await fetch(getBooksUrl.href);
        const json: ApiResponse<Book> = await response.json();


        return { items: replaceNullsWithEmptyStrings(json.items), metaData: json.metaData } as ApiData<Book>;
      },
      placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
    });
  }

  /**
    Prevents MaterialReactTable warnings if there are 'null' results
  **/
  function replaceNullsWithEmptyStrings(bookItems: Array<Book>): Array<Book> {
    return bookItems.map(b => {
      if (b.note === null) {
        b.note = '';
      }

      if (b.author === null) {
        b.author = '';
      }

      if (b.publisher === null) {
        b.publisher = '';
      }

      if (b.collection === null) {
        b.collection = '';
      }

      if (b.category === null) {
        b.category = { id: '0', name: '' };
      }

      if (b.year === null) {
        b.year = 0;
      }

      if (b.read === null) {
        b.read = false;
      }

      return b;
    });
  }

  function useGetCategories() {
    return useQuery<Array<Category>>({
      queryKey: [
        'categoryData'
      ],
      queryFn: async () => {
        const getCategoriesUrl = new URL(
          'category', getApiUrl(),
        );
        // URL e.g. api/book?PageNumber=0&pageSize=10&title=long&author=nick&globalFilter=&OrderBy=author+asc
        getCategoriesUrl.searchParams.set('pageSize', '100');
        const response = await fetch(getCategoriesUrl.href);
        const json: ApiResponse<Category> = await response.json();

        return json.items;
      },
    });
  }

  const { mutateAsync: createBook, isPending: isCreatingBook } =
    useCreateBook();

  const { mutateAsync: updateBook, isPending: isUpdatingBook } =
    useUpdateBook();

  function useCreateBook() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (book: Book) => {
        const reqOpt = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(book)
        };

        const putBookUrl = new URL(
          `book`, getApiUrl(),
        );

        return fetch(putBookUrl, reqOpt);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['bookData'] })
      },
    });
  }

  function useUpdateBook() {

    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (book: Book) => {
        const reqOpt = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(book)
        };

        const bookUrl = new URL(
          `book/${book.id}`, getApiUrl(),
        );

        return fetch(bookUrl, reqOpt);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['bookData'] })
      },
    });
  }


  function useDeleteBook() {

    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (id: number) => {
        const reqOpt = {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        };

        const bookUrl = new URL(
          `book/${id}`, getApiUrl(),
        );

        return fetch(bookUrl, reqOpt);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['bookData'] })
      },
    });
  }

  function useDeleteBookList() {

    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (idList: Array<number>) => {
        const reqOpt = {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(idList)
        };

        const bookUrl = new URL(
          `book`, getApiUrl(),
        );

        return fetch(bookUrl, reqOpt);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['bookData'] })
      },
    });
  }

  const onSelectCategory = (selectedCategory: string): void => {
    setSelectedCategoryId(selectedCategory);
  }

  const handleSaveBook: MRT_TableOptions<Book>['onEditingRowSave'] = async ({
    values,
    table
  }) => {
    values.categoryId = selectedCategoryId;
    values.id = selectedBookId;
    let newValidationErrors: any = {};
    let bla = new Map();

    await bookValidationSchema.validate(values, { abortEarly: false }).then(v => {
      console.log();
    }).catch(e => {
      e.errors.forEach((error: string) => {
        bla.set(error.toLowerCase().split(" ")[0], error);
      });

      // console.log('proba=>'+ proba);
      newValidationErrors = Object.fromEntries(bla);
    });

    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }

    setValidationErrors({});
    await updateBook(values);
    table.setEditingRow(null); //exit editing mode
  };

  const handleCreateBook: MRT_TableOptions<Book>['onCreatingRowSave'] = async ({
    values,
    table,
  }) => {

    // prevents the user to hit 'save' several times in a row and to insert duplicate records
    if (disableSaveOnInsert)
      return;

    setDisableSaveOnInsert(true);
    values.categoryId = selectedCategoryId === '0' ? null : selectedCategoryId;
    let newValidationErrors: any = {};
    let bla = new Map();

    await bookValidationSchema.validate(values, { abortEarly: false }).then(v => {
      console.log();
    }).catch(e => {
      e.errors.forEach((error: string) => {
        bla.set(error.toLowerCase().split(" ")[0], error);
      });

      newValidationErrors = Object.fromEntries(bla);
    });

    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }

    setValidationErrors({});
    await createBook(values);
    setDisableSaveOnInsert(false);
    table.setCreatingRow(null); //exit creating mode
  };


  const {
    data: categoryItems = [],
    isError: isErrorCategorySelectItems,
    isLoading: isLoadingCategorySelectItems,
  } = useGetCategories();


  const { mutateAsync: deleteBook, isPending: isDeletingBook } =
    useDeleteBook();

  const { mutateAsync: deleteBookList, isPending: isDeletingBookList } =
    useDeleteBookList();

  const columns = useMemo<MRT_ColumnDef<Book>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        muiEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.title,
          helperText: validationErrors?.title,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              title: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        }
      },
      {
        accessorKey: 'author',
        header: 'Author',
        muiEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.author,
          helperText: validationErrors?.author,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              author: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        }
      },
      {
        accessorKey: 'category.name',
        header: 'Category',
        Edit: ({ cell, column, row, table }) => {
          let editStatus: EditStatus | undefined;

          if (table.getState().editingRow) {
            editStatus = EditStatus.update;
          }
          else if (table.getState().creatingRow) {
            editStatus = EditStatus.insert;
          }

          useEffect(() => {
            if (editStatus === EditStatus.update) {
              setSelectedBookId(row.id);
            }
          }, []);

          const originalBookCategory = editStatus === EditStatus.update ? row.original.category?.id : '0';

          return <CategorySelection onSelectCategory={onSelectCategory} selectedCategory={originalBookCategory} inputData={categoryItems} />;
        },
        filterVariant: 'select',
        filterSelectOptions: categoryItems.map(c => { return { label: c.name, value: c.name } })
      },
      {
        accessorKey: 'note',
        header: 'Note',
        muiEditTextFieldProps: {
          type: 'email',
          error: !!validationErrors?.note,
          helperText: validationErrors?.note,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              note: undefined,
            }),
        }
      },
      {
        accessorKey: 'publisher',
        header: 'Publisher',
        muiEditTextFieldProps: {
          type: 'email',
          error: !!validationErrors?.publisher,
          helperText: validationErrors?.publisher,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              note: undefined,
            }),
        }
      },
      {
        accessorKey: 'collection',
        header: 'Collection',
        muiEditTextFieldProps: {
          type: 'email',
          error: !!validationErrors?.collection,
          helperText: validationErrors?.collection,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              note: undefined,
            }),
        }
      },
      {
        accessorKey: 'year',
        header: 'Year',
        enableColumnFilter: false,
        enableColumnActions: false,
        enableColumnOrdering: false,
        enableSorting: false,
        muiEditTextFieldProps: {
          type: 'number',
          error: !!validationErrors?.year,
          helperText: validationErrors?.year,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              note: undefined,
            }),
        }
      },
      {
        accessorKey: 'read',
        header: 'Read',
        enableColumnFilter: false,
        enableColumnActions: false,
        enableColumnOrdering: false,
        enableSorting: false,
        editVariant: 'select',
        editSelectOptions: [{ label: 'already read', value: true }, { label: 'not yet', value: false }],
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.read,
          helperText: validationErrors?.read
        },
        Cell: ({ cell }) => (
          cell.getValue<boolean>() ? <EmojiEvents color="primary" /> : <Close color="primary" />
        )
      }
    ],
    [validationErrors, categoryItems],
  );

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Book>) => {
    if (window.confirm(`Are you sure you want to delete the book "${row.original.title}"?`)) {
      deleteBook(row.original.id);
    }
  };

  const openDeleteListConfirmModal = (rows: Array<MRT_Row<Book>>) => {
    const titlesToDelete = rows.map(t => t.original.title);

    // TODO: create modal popup
    if (window.confirm(`Are you sure you want to delete selected books: "${JSON.stringify(titlesToDelete)}"?`)) {
      deleteBookList(rows.map(r => +r.id));
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: items,
    enableRowSelection: true,
    initialState: {
      columnVisibility: {
        note: false, collection: false,
        publisher: false, 'category.name': false,
        year: false, read: false
      },
      showColumnFilters: true
    },
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.id?.toString(),
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isLoadingBooksError
      ? {
        color: 'error',
        children: 'Error loading data',
      }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,

    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateBook,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveBook,

    renderTopToolbarCustomActions: ({ table }) => (
      <>
        <Tooltip arrow title="Refresh Data">
          <IconButton onClick={() => refetchBook()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <Button
          variant="contained"
          onClick={() => {
            const myBook: Book = {
              id: 0, title: '',
              author: '',
              category: {
                id: '',
                name: ''
              },
              categoryId: '',
              note: '',
              publisher: '',
              collection: '',
              read: false,
              year: 1
            };
            // I am sending an empty book object because of MaterialReactTable is complaining if 'deep reference'
            // 'category.name' field is 'undefined'
            table.setCreatingRow(
              createRow(table, myBook)
            );
          }}
        >
          New book
        </Button>
        <Button disabled={!table.getIsSomeRowsSelected()}
          onClick={() => {
            const selectedRows = table.getSelectedRowModel().rows;
            openDeleteListConfirmModal(selectedRows);
          }}
        >
          delete selected
        </Button>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    rowCount: metaData?.totalCount,
    state: {
      columnFilters,
      globalFilter,
      isLoading: isLoadingBooks,
      pagination,
      showAlertBanner: isLoadingBooksError,
      showProgressBars: isRefetchingBooks,
      sorting,
    },
  });

  return <MaterialReactTable table={table} />;
}

const queryClient = new QueryClient();

const BookListQueryProvider = () => (
  //App.tsx or AppProviders file. Don't just wrap this component with QueryClientProvider! Wrap your whole App!
  <QueryClientProvider client={queryClient}>
    <BookList />
  </QueryClientProvider>
);

// TODO: extract max values
const bookValidationSchema = object({
  title: string().required('Title is required.').max(195, `Title maximum length limit is 195`),
  author: string().max(55, `Author maximum length limit is 55`),
  note: string().max(4000, `Note maximum length limit is 4000`),
  publisher: string().max(55, `Publisher maximum length limit is 55`),
  collection: string().max(55, `Collection maximum length limit is 55`),
  year: number().moreThan(0).lessThan(2050).integer('Year must be an integer')
});

export default BookListQueryProvider;