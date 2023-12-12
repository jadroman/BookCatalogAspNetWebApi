import { useEffect, useMemo, useState } from 'react';
import { object, string, number, date } from 'yup';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
  MRT_Row,
  MRT_TableOptions,
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
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategorySelection from 'components/Category/CategorySelection';

type Book = {
  id: number,
  title: string,
  author: string,
  category: Category,
  categoryId: string,
  note: string,
  publisher: string,
  collection: string,
  read: boolean,
  year: number
}

type Category = {
  id: string,
  name: string
}

type BookApiData = {
  bookItems: Array<Book>;
  booksMetaData: {
    totalCount: number;
  };
};

type BookApiResponse = {
  items: Array<Book>;
  metaData: {
    totalCount: number;
  };
};

type CategoriesApiResponse = {
  items: Array<Category>;
  metaData: {
    totalCount: number;
  };
};

type CategoryApiData = {
  categoryItems: Array<Category>;
  categoriesMetaData: {
    totalCount: number;
  };
};

const BookList = () => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('0');
  const [selectedBookId, setSelectedBookId] = useState<string>('0');

  //manage our own state for stuff we want to pass to the API
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([],);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  function useGetBooks() {
    return useQuery<BookApiData>({
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
        const json: BookApiResponse = await response.json();

        return { bookItems: json.items, booksMetaData: json.metaData } as BookApiData;
      },
      placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
    });
  }

  function useGetCategories() {
    return useQuery<CategoryApiData>({
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
        const json: CategoriesApiResponse = await response.json();

        return { categoryItems: json.items, categoriesMetaData: json.metaData } as CategoryApiData;
      },
    });
  }

  const { mutateAsync: updateBook, isPending: isUpdatingBook } =
    useUpdateBook();

  function useUpdateBook() {

    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (book: Book) => {
        const reqOpt = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(book)
        };

        const putBookUrl = new URL(
          `book/${book.id}`, getApiUrl(),
        );

        return fetch(putBookUrl, reqOpt);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['bookData'] })
      },
    });
  }

  const {
    data: { bookItems = [], booksMetaData } = {},
    isError: isLoadingBooksError,
    isRefetching: isRefetchingBooks,
    isLoading: isLoadingBooks,
    refetch: refetchBook,
  } = useGetBooks();

  const onSelectCategory = (selectedCategory: string): void => {
    setSelectedCategoryId(selectedCategory);
  }

  const handleSaveBook: MRT_TableOptions<Book>['onEditingRowSave'] = async ({
    values,
    table
  }) => {
    values.categoryId = selectedCategoryId;
    values.id = selectedBookId;

    let tempVal =  {title: "", author: ""}; 

    //const newValidationErrors = validateUser2(tempVal);
    let newValidationErrors: any =  {}; 
    

    //let bla: Array<Record<string,string>> = new Array<Record<string,string>>();
    
    let bla2 = new Map();

    bla2.set('proba1', 1);
    bla2.set('proba2', 2);
    /* console.log('map size=>'+bla2.size);
    console.log('map values=>'+Array.from(bla2.values())); */



    let proba: string = "";
    let bla = new Map();

    await bookValidationSchema.validate(values, { abortEarly: false }).then(v => {
      console.log();
    }).catch(e => {
      e.errors.forEach((error: string) => {
        bla.set(error.toLowerCase().split(" ")[0], error);  

        //proba+=error;
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

          useEffect(() => {
            setSelectedBookId(row.id);
          }, []);

          const {
            data: { categoryItems = [], categoriesMetaData } = {},
            isError: isLoadingCategoryError,
            isLoading: isLoadingCategories,
          } = useGetCategories();

          const originalBookCategory = row.original.category.id;

          return isLoadingCategories ?
            <CircularProgress /> :
            <CategorySelection onSelectCategory={onSelectCategory} selectedCategory={originalBookCategory} inputData={categoryItems} />;
        },
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
        muiEditTextFieldProps: {
          type: 'checkbox',
          error: !!validationErrors?.read,
          helperText: validationErrors?.read,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              note: undefined,
            }),
        }
      }
    ],
    [validationErrors],
  );

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Book>) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      //deleteUser(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: bookItems,
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
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveBook,

    renderTopToolbarCustomActions: () => (
      <Tooltip arrow title="Refresh Data">
        <IconButton onClick={() => refetchBook()}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
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
    rowCount: booksMetaData?.totalCount,
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
  year: number().positive('Year must be a positive number').integer('Year must be an integer')
});

const validateRequired = (value: string) => !!value.length;

function validateUser(book: Book) {
  return {
    title: !validateRequired(book.title)
      ? 'Title is Required'
      : '',
    author: !validateRequired(book.author)
      ? 'author is Required'
      : '',
  };
}

function validateUser2(book: any) {
  return {
    title: !validateRequired(book.title)
      ? 'Title is Required'
      : '',
    author: !validateRequired(book.author)
      ? 'author is Required'
      : '',
  };
}

export default BookListQueryProvider;