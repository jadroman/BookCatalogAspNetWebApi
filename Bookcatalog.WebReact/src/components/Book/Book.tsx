//export function bla() { }
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { MRT_ColumnDef, MRT_ColumnFiltersState, MRT_PaginationState, MRT_Row, MRT_SortingState, MRT_TableInstance, MRT_TableOptions, MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { Book as BookEntity } from "types/book";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { number, object, string } from "yup";
import { ApiData, EditStatus } from "types/shared";
import CategorySelection from "components/Category/CategorySelection";
import { Close, EmojiEvents } from "@mui/icons-material";
import { Category } from "types/category";
import { ColumnFiltersState, Updater } from "@tanstack/react-table";

// TODO: put on a common place
export type BookListTableProps = {
    onUpdateBook: (values: any) => Promise<void>;
    onCreateBook: (values: any) => Promise<void>;
    onDeleteBook: (id: number) => Promise<void>;
    onDeleteBookList: (idList: Array<number>) => Promise<void>;
    onRefetchBook: () => Promise<void>;
    onCreateRow: (table: MRT_TableInstance<BookEntity>, book: BookEntity) => MRT_Row<BookEntity>;
    onColumnFiltersChange: (filters: Updater<ColumnFiltersState>) => void;
    onGlobalFilterChange: (filters: any) => void;
    onPaginationChange: (pagination: Updater<MRT_PaginationState>) => void;
    onSortingChange: (pagination: Updater<MRT_SortingState>) => void;
    categoryItems: Array<Category>;
    //bookItems: Array<Book>;
    bookApiData: ApiData<BookEntity>;
    isLoadingBooks: boolean;
    isLoadingBooksError: boolean;
    isRefetchingBooks: boolean;
};

export const Book = (props: BookListTableProps) => {

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


    const onSelectCategory = (selectedCategory: string): void => {
        setSelectedCategoryId(selectedCategory);
    }

    const handleSaveBook: MRT_TableOptions<BookEntity>['onEditingRowSave'] = async ({
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
        await props.onUpdateBook(values);
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
        await props.onCreateBook(values);
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

                    return <CategorySelection onSelectCategory={onSelectCategory} selectedCategory={originalBookCategory} inputData={props.categoryItems} />;
                },
                filterVariant: 'select',
                filterSelectOptions: props.categoryItems.map(c => { return { label: c.name, value: c.name } })
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
        [validationErrors, props.categoryItems],
    );

    //DELETE action
    const openDeleteConfirmModal = async (row: MRT_Row<BookEntity>) => {
        if (window.confirm(`Are you sure you want to delete the book "${row.original.title}"?`)) {
            await props.onDeleteBook(row.original.id);
        }
    };

    const openDeleteListConfirmModal = async (rows: Array<MRT_Row<BookEntity>>) => {
        const titlesToDelete = rows.map(t => t.original.title);

        // TODO: create modal popup
        if (window.confirm(`Are you sure you want to delete selected books: "${JSON.stringify(titlesToDelete)}"?`)) {
            await props.onDeleteBookList(rows.map(r => +r.id));
        }
    };

    const table = useMaterialReactTable({
        columns,
        data: props.bookApiData.items,
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
        muiToolbarAlertBannerProps: props.isLoadingBooksError
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        onColumnFiltersChange: (f) => {
            props.onColumnFiltersChange(f);
            setColumnFilters(f);
        },
        onGlobalFilterChange: (f) => {
            props.onGlobalFilterChange(f);
            setGlobalFilter(f);
        },
        onPaginationChange: (f) => {
            props.onPaginationChange(f);
            setPagination(f);
        },
        onSortingChange: (f) => {
            props.onSortingChange(f);
            setSorting(f);
        },

        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCreateBook,
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleSaveBook,

        renderTopToolbarCustomActions: ({ table }) => (
            <>
                <Tooltip arrow title="Refresh Data">
                    <IconButton onClick={async () => props.onRefetchBook()}>
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
                            props.onCreateRow(table, myBook)
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
        rowCount: props.bookApiData.metaData?.totalCount,
        state: {
            columnFilters,
            globalFilter,
            isLoading: props.isLoadingBooks,
            pagination,
            showAlertBanner: props.isLoadingBooksError,
            showProgressBars: props.isRefetchingBooks,
            sorting,
        },
    });

    return <MaterialReactTable table={table} />;

};

// TODO: extract max values
const bookValidationSchema = object({
    title: string().required('Title is required.').max(195, `Title maximum length limit is 195`),
    author: string().max(55, `Author maximum length limit is 55`),
    note: string().max(4000, `Note maximum length limit is 4000`),
    publisher: string().max(55, `Publisher maximum length limit is 55`),
    collection: string().max(55, `Collection maximum length limit is 55`),
    year: number().moreThan(0).lessThan(2050).integer('Year must be an integer')
});