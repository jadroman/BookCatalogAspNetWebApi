import { AlertProps, Box, Button, IconButton, Tooltip } from "@mui/material";
import {
    MRT_ColumnDef, MRT_ColumnFiltersState, MRT_PaginationState, MRT_Row,
    MRT_SortingState, MRT_TableOptions, MaterialReactTable, createRow, useMaterialReactTable
} from "material-react-table";
import { useMemo, useState } from "react";
import { Book as BookEntity } from "types/book";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { TableEditStatus } from "types/shared";
import CategorySelection from "components/Category/CategorySelection";
import { Close, EmojiEvents } from "@mui/icons-material";
import * as hooks from "data/bookHooks";
import { bookTableDefaultPageSize } from "config/book";
import {
    bookValidationSchema, calculateAndformatDateTime, cutStringIfTooLong, getAllRowArrayForExport,
    getCurrentDateForExportedFileTitle, getSelectedRowArrayForExport
} from "utils/book";
import { refreshToken } from "utils/auth";
import styles from "./Book.module.scss"
import { Button as BootstrapButton } from "react-bootstrap";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

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
        data: categoryItems = []
    } = hooks.useGetCategories();

    const { mutateAsync: create, isError: isCreateBookError } =
        hooks.useCreateBook();

    const { mutateAsync: update, isError: isUpdateBookError } =
        hooks.useUpdateBook();

    const { mutateAsync: deleteBook, isError: isDeleteBookError } =
        hooks.useDeleteBook();

    const { mutateAsync: deleteList, isError: isDeleteBookListError } =
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
        let validationErrorsObj: any = {};
        let errorsMap = new Map();

        await bookValidationSchema.validate(values, { abortEarly: false }).then(v => {
            console.log();
        }).catch(e => {
            e.errors.forEach((error: string) => {
                errorsMap.set(error.toLowerCase().split(" ")[0], error);
            });

            validationErrorsObj = Object.fromEntries(errorsMap);
        });

        if (Object.values(validationErrorsObj).some((error) => error)) {
            setValidationErrors(validationErrorsObj);
            return;
        }

        setValidationErrors({});

        await update(values);
        table.setEditingRow(null);
    };

    const handleCreateBook: MRT_TableOptions<BookEntity>['onCreatingRowSave'] = async ({
        values,
        table,
    }) => {
        // prevents user to hit 'save' several times in a row and to insert duplicate records
        if (disableSaveOnInsert)
            return;

        setDisableSaveOnInsert(true);
        values.categoryId = selectedCategoryId === '0' ? null : selectedCategoryId;
        let validationErrorsObj: any = {};
        let errorsMap = new Map();

        await bookValidationSchema.validate(values, { abortEarly: false }).then(v => {
        }).catch(e => {
            e.errors.forEach((error: string) => {
                errorsMap.set(error.toLowerCase().split(" ")[0], error);
            });

            validationErrorsObj = Object.fromEntries(errorsMap);
        });

        if (Object.values(validationErrorsObj).some((error) => error)) {
            setValidationErrors(validationErrorsObj);
            setDisableSaveOnInsert(false);
            return;
        }

        setValidationErrors({});
        await create(values);
        setDisableSaveOnInsert(false);
        table.setCreatingRow(null);
    };


    const columns = useMemo<MRT_ColumnDef<BookEntity>[]>(
        () => [
            {
                accessorKey: 'title',
                header: 'Title',
                muiEditTextFieldProps: {
                    type: 'text',
                    required: true,
                    inputProps: { autoComplete: 'off' },
                    error: !!validationErrors?.title,
                    helperText: validationErrors?.title,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            title: undefined,
                        })
                },
                muiFilterTextFieldProps: {
                    inputProps: { autoComplete: 'off' }
                }
            },
            {
                accessorKey: 'author',
                header: 'Author',
                muiEditTextFieldProps: {
                    type: 'text',
                    required: false,
                    inputProps: { autoComplete: 'off' },
                    error: !!validationErrors?.author,
                    helperText: validationErrors?.author,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            author: undefined,
                        })
                },
                muiFilterTextFieldProps: {
                    inputProps: { autoComplete: 'off' }
                }
            },
            {
                // for the category field we create our custom control
                accessorKey: 'category.name',
                header: 'Category',
                Edit: ({ row, table }) => {
                    let editStatus: TableEditStatus | undefined;

                    if (table.getState().editingRow) {
                        editStatus = TableEditStatus.update;
                    }
                    else if (table.getState().creatingRow) {
                        editStatus = TableEditStatus.insert;
                    }

                    const originalBookCategory = editStatus === TableEditStatus.update ? row.original.category?.id.toString() : '0';

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
                    inputProps: { autoComplete: 'off' },
                    multiline: true,
                    rows: 4,
                    error: !!validationErrors?.note,
                    helperText: validationErrors?.note,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            note: undefined,
                        }),
                },
                Cell: ({ cell }) => {
                    if (cell.getValue()) {
                        return <div>{cutStringIfTooLong(cell.getValue() as string, 40)}</div>;
                    }
                },
                muiFilterTextFieldProps: {
                    inputProps: { autoComplete: 'off' }
                }
            },
            {
                accessorKey: 'publisher',
                header: 'Publisher',
                muiEditTextFieldProps: {
                    type: 'text',
                    error: !!validationErrors?.publisher,
                    helperText: validationErrors?.publisher,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            publisher: undefined,
                        }),
                }
            },
            {
                accessorKey: 'collection',
                header: 'Collection',
                muiEditTextFieldProps: {
                    type: 'text',
                    error: !!validationErrors?.collection,
                    helperText: validationErrors?.collection,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            collection: undefined,
                        }),
                }
            },
            {
                accessorKey: 'year',
                header: 'Year',
                enableColumnFilter: false,
                enableColumnActions: false,
                enableColumnOrdering: false,
                enableSorting: true,
                muiEditTextFieldProps: {
                    type: 'number',
                    inputProps: { autoComplete: 'off' },
                    error: !!validationErrors?.year,
                    helperText: validationErrors?.year,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            year: undefined,
                        }),
                }
            },
            {
                accessorKey: 'read',
                header: 'Read',
                enableColumnFilter: false,
                enableColumnActions: false,
                enableColumnOrdering: false,
                enableSorting: true,
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
            },
            {
                accessorKey: 'timeOfCreation',
                header: 'Time Of Creation',
                enableEditing: false,
                enableColumnFilter: false,
                enableColumnActions: false,
                enableColumnOrdering: true,
                enableSorting: true,
                Cell: ({ cell }) => calculateAndformatDateTime(cell.getValue<string>()),
                Edit: () => { return <></> }
            },
            {
                accessorKey: 'timeOfLastChange',
                header: 'Time Of Last Change',
                enableEditing: false,
                enableColumnFilter: false,
                enableColumnActions: false,
                enableColumnOrdering: true,
                enableSorting: true,
                Cell: ({ cell }) => calculateAndformatDateTime(cell.getValue<string>()),
                Edit: () => { return <></> }
            }
        ],
        [validationErrors, categoryItems],
    );

    const openDeleteConfirmModal = async (row: MRT_Row<BookEntity>) => {
        if (window.confirm(`Are you sure you want to delete the book "${row.original.title}"?`)) {
            await deleteBook(row.original.id);
        }
    };

    const openDeleteListConfirmModal = async (rows: Array<MRT_Row<BookEntity>>) => {
        const titlesToDelete = rows.map(t => t.original.title);

        if (window.confirm(`Are you sure you want to delete selected books: "${JSON.stringify(titlesToDelete)}"?`)) {
            await deleteList(rows.map(r => +r.id));
        }
    };

    const exportSelectedToPDF = (rows: MRT_Row<BookEntity>[]) => {
        const doc = new jsPDF();
        const tableData = rows.map((row) => getSelectedRowArrayForExport(row));
        const tableHeaders = [['Title'], ['Author']];

        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
        });

        doc.save(`BookCatalog_${getCurrentDateForExportedFileTitle()}.pdf`);
    };

    const exportAllToPDF = async () => {
        const allBooks = await hooks.getAllBooks();
        const doc = new jsPDF('l');
        const tableData = allBooks.map((row) => getAllRowArrayForExport(row));
        const tableHeaders = [['Title'], ['Author'], ['Category']];

        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
        });

        doc.save(`BookCatalog_${getCurrentDateForExportedFileTitle()}.pdf`);
    };

    const getTableToolbarAlertProps = () => {
        let errorLabel = '';

        if (isLoadingBooksError)
            errorLabel += 'An error accured while loading data. ';

        if (isCreateBookError)
            errorLabel += 'An error accured while creating a book. ';

        if (isUpdateBookError)
            errorLabel += 'An error accured while updating a book. ';

        if (isDeleteBookError)
            errorLabel += 'An error accured while deleting a book. ';

        if (isDeleteBookListError)
            errorLabel += 'An error accured while deleting a list of books. ';

        if (isLoadingBooksError || isCreateBookError || isUpdateBookError || isDeleteBookError || isDeleteBookListError)
            return {
                color: 'error',
                children: errorLabel + ' Pls try again.',
            } as AlertProps;
        else
            return undefined;
    }

    const table = useMaterialReactTable({
        columns,
        data: items,
        enableRowSelection: true,
        enableGlobalFilter: false,
        initialState: {
            columnVisibility: {
                note: false, collection: false,
                publisher: false, 'category.name': false,
                year: false, read: false, timeOfCreation: false, timeOfLastChange: false
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
        muiToolbarAlertBannerProps: getTableToolbarAlertProps(),
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,

        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCreateBook,
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleSaveBook,

        renderTopToolbarCustomActions: ({ table }) => (
            <div className={styles.gridToolbarWrapper}>
                <Tooltip arrow title="Refresh Data">
                    <IconButton onClick={async () => refetchBooks()}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
                <Button
                    variant="contained"
                    onClick={async () => {
                        await refreshToken();

                        const myBook: BookEntity = {
                            id: 0, title: '',
                            author: '',
                            category: {
                                id: 0,
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
                    Add New
                </Button>
                {(table.getSelectedRowModel().rows.length > 0) &&
                    <BootstrapButton className={`${styles.button} btn btn-danger`}
                        onClick={async () => {
                            await refreshToken();
                            const selectedRows = table.getSelectedRowModel().rows;
                            openDeleteListConfirmModal(selectedRows);
                        }}>Delete selected
                    </BootstrapButton>
                }
                {(table.getSelectedRowModel().rows.length > 0) &&
                    <Button title="Export selected to pdf" className={`${styles.button}`}
                        onClick={async () => {
                            const selectedRows = table.getSelectedRowModel().rows;
                            exportSelectedToPDF(selectedRows);
                        }} startIcon={<FileDownloadIcon />}>Export Selected
                    </Button>
                }
                <Button title="Export all existing books to pdf" className={`${styles.button}`}
                    onClick={async () => {
                        exportAllToPDF();
                    }} startIcon={<FileDownloadIcon />}>Export All
                </Button>
            </div>
        ),
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip title="Edit">
                    <IconButton onClick={async () => {
                        await refreshToken();
                        setSelectedBookId(row.id);
                        table.setEditingRow(row);
                    }}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton color="error" onClick={async () => {
                        await refreshToken();
                        openDeleteConfirmModal(row)
                    }}>
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
            showAlertBanner: isLoadingBooksError || isCreateBookError || isUpdateBookError ||
                isDeleteBookError || isDeleteBookListError,
            showProgressBars: isRefetchingBooks,
            sorting,
        },
    });

    return <>
        <MaterialReactTable table={table} />
    </>;

};
