import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { MRT_ColumnDef, MRT_ColumnFiltersState, MRT_PaginationState, MRT_Row, MRT_SortingState, MRT_TableOptions, MaterialReactTable, createRow, useMaterialReactTable } from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { Book as BookEntity } from "types/book";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { EditStatus } from "types/shared";
import CategorySelection from "components/Category/CategorySelection";
import { Close, EmojiEvents } from "@mui/icons-material";
import * as hooks from "data/bookHooks";
import { bookTableDefaultPageSize } from "config/book";
import { bookValidationSchema } from "utils/book";

export const Book = () => {
    const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('0');
    const [selectedBookId, setSelectedBookId] = useState<string>('0');
    const [disableSaveOnInsert, setDisableSaveOnInsert] = useState<boolean>(false);

    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([],);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: bookTableDefaultPageSize,
    });

    const {
        data: { items = [], metaData = { totalCount: 0 } } = {},
        isError: isLoadingBooksError,
        isRefetching: isRefetchingBooks,
        isLoading: isLoadingBooks,
        refetch: refetchBooks,
    } = hooks.useGetBooks(columnFilters, globalFilter,
        pagination, sorting);

    const {
        data: categoryItems = [],
        isError: isErrorCategorySelectItems,
        isLoading: isLoadingCategorySelectItems,
    } = hooks.useGetCategories();

    const { mutateAsync: create, isPending: isCreatingBook } =
        hooks.useCreateBook();

    const { mutateAsync: update, isPending: isUpdatingBook } =
        hooks.useUpdateBook();

    const { mutateAsync: deleteBook, isPending: isDeletingBook } =
        hooks.useDeleteBook();

    const { mutateAsync: deleteList, isPending: isDeletingBookList } =
        hooks.useDeleteBookList();

    const onSelectCategory = (selectedCategory: string): void => {
        setSelectedCategoryId(selectedCategory);
    }

    const handleSaveBook: MRT_TableOptions<BookEntity>['onEditingRowSave'] = async ({
        values,
        table
    }) => {
        values.categoryId = selectedCategoryId === '0' ? null : selectedCategoryId;
        values.id = selectedBookId;
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
        await update(values);
        table.setEditingRow(null); //exit editing mode
    };

    const handleCreateBook: MRT_TableOptions<BookEntity>['onCreatingRowSave'] = async ({
        values,
        table,
    }) => {
        // prevents the user to hit 'save' several times in a row and to insert duplicate records
        if (disableSaveOnInsert)
            return;

        setDisableSaveOnInsert(true);
        values.categoryId = selectedCategoryId === '0' ? null : selectedCategoryId;
        let newValidationErrors: any = {};
        let errors = new Map();

        await bookValidationSchema.validate(values, { abortEarly: false }).then(v => {
        }).catch(e => {
            e.errors.forEach((error: string) => {
                errors.set(error.toLowerCase().split(" ")[0], error);
            });

            newValidationErrors = Object.fromEntries(errors);
        });

        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            setDisableSaveOnInsert(false);
            return;
        }

        setValidationErrors({});
        await create(values);
        setDisableSaveOnInsert(false);
        table.setCreatingRow(null); //exit creating mode
    };


    const columns = useMemo<MRT_ColumnDef<BookEntity>[]>(
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
                    type: 'text',
                    required: false,
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
                    type: 'text',
                    multiline: true,
                    rows: 4,
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
    const openDeleteConfirmModal = async (row: MRT_Row<BookEntity>) => {
        if (window.confirm(`Are you sure you want to delete the book "${row.original.title}"?`)) {
            await deleteBook(row.original.id);
        }
    };

    const openDeleteListConfirmModal = async (rows: Array<MRT_Row<BookEntity>>) => {
        const titlesToDelete = rows.map(t => t.original.title);

        // TODO: create modal popup
        if (window.confirm(`Are you sure you want to delete selected books: "${JSON.stringify(titlesToDelete)}"?`)) {
            await deleteList(rows.map(r => +r.id));
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
                    <IconButton onClick={async () => refetchBooks()}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
                <Button
                    variant="contained"
                    onClick={() => {
                        const myBook: BookEntity = {
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
                <Button disabled={table.getSelectedRowModel().rows.length < 2}
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

};
