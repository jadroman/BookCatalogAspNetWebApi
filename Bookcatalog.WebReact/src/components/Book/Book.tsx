import { AlertProps, Box, Button, IconButton, Snackbar, Tooltip } from "@mui/material";
import { MRT_ColumnDef, MRT_ColumnFiltersState, MRT_PaginationState, MRT_Row, MRT_SortingState, MRT_TableOptions, MaterialReactTable, createMRTColumnHelper, createRow, useMaterialReactTable } from "material-react-table";
import { useMemo, useState } from "react";
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
import { refreshToken } from "utils/auth";
import styles from "./Book.module.scss"
import { Button as BootstrapButton } from "react-bootstrap";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import moment from "moment";


export const Book = () => {
    const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('0');
    const [selectedBookId, setSelectedBookId] = useState<string>('0');
    const [disableSaveOnInsert, setDisableSaveOnInsert] = useState<boolean>(false);
    const [notificationPopupMessage, setNotificationPopupMessage] = useState<string>('');

    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([],);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: bookTableDefaultPageSize,
    });
    // this is comment for Sanja
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

    const { mutateAsync: create, isPending: isCreatingBook, isError: isCreateBookError, error: createBookError } =
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

                    const originalBookCategory = editStatus === EditStatus.update ? row.original.category?.id.toString() : '0';

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
                enableSorting: true,
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
                Cell: ({ cell }) => calculateAndformatDateTime(cell.getValue<string>())
            },
            {
                accessorKey: 'timeOfLastChange',
                header: 'Time Of Last Change',
                enableEditing: false,
                enableColumnFilter: false,
                enableColumnActions: false,
                enableColumnOrdering: true,
                enableSorting: true,
                Cell: ({ cell }) => calculateAndformatDateTime(cell.getValue<string>())
            }
        ],
        [validationErrors, categoryItems],
    );

    /**  
     * On the backend we are useng UTC(Coordinated Universal Time).
     * Here, on the frontend, we are determing how much the current user time zone is offset from UTC
     * so we could calculate it to show it to the user correctly
    */
    const calculateAndformatDateTime = (rowDateTime: string) => {
        if (rowDateTime) {
            let UTCoffset = new Date().getTimezoneOffset();
            let minutesToAdd = UTCoffset * (-1);
            let convertedToDate = new Date(rowDateTime);
            var convertedToRightTimeZone = moment(convertedToDate).add(minutesToAdd, 'm').toDate();

            return `${convertedToRightTimeZone.toLocaleDateString('hr-HR')} ${convertedToRightTimeZone.toLocaleTimeString('hr-HR')}`
        }

        return '';
    }

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

    const getRowArrays = (row: MRT_Row<BookEntity>) => {
        return [row.original.title ? cutStringIfTooLong(replaceProblematicCaracters(row.original.title), 44) : '', row.original.author ? cutStringIfTooLong(replaceProblematicCaracters(row.original.author), 23) : ''];
    }

    const getAllRowArrays = (row: BookEntity) => {
        return [row.title ? cutStringIfTooLong(replaceProblematicCaracters(row.title), 44) : '',
        row.author ? cutStringIfTooLong(replaceProblematicCaracters(row.author), 23) : '',
        row.category?.name ? cutStringIfTooLong(replaceProblematicCaracters(row.category?.name), 23) : 'No Category'];
    }

    const replaceProblematicCaracters = (stringToCheck: string) => {
        return stringToCheck.replaceAll('č', 'c')
            .replaceAll('Č', 'C')
            .replaceAll('Ć', 'C')
            .replaceAll('ć', 'c')
            .replaceAll('Đ', 'D')
            .replaceAll('đ', 'd');
    }

    const cutStringIfTooLong = (stringToCut: string, maxLength: number) => {
        if (stringToCut.length > maxLength) {
            stringToCut = stringToCut.substring(0, maxLength);
        }

        return stringToCut;
    }

    const exportSelected = (rows: MRT_Row<BookEntity>[]) => {
        const doc = new jsPDF();

        const tableData = rows.map((row) => getRowArrays(row));
        const tableHeaders = [['Title'], ['Author']];

        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
        });
        doc.save('BookCatalog.pdf');
    };

    const exportAll = async () => {
        const allBooks = await hooks.useGetAllBooks();

        const doc = new jsPDF('l');

        const tableData = allBooks.map((row) => getAllRowArrays(row));
        const tableHeaders = [['Title'], ['Author'], ['Category']];

        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
        });
        doc.save('BookCatalog.pdf');
    };

    const getAlertProps = () => {
        let errorLabel = 'Unknown error accured.'

        if (isLoadingBooksError)
            errorLabel = 'Error loading data'

        if (isCreateBookError)
            errorLabel = 'Create book error. Pls try again.'

        if (isLoadingBooksError || isCreateBookError)
            return {
                color: 'error',
                children: errorLabel,
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
        muiToolbarAlertBannerProps: getAlertProps(),
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
                            exportSelected(selectedRows);
                        }} startIcon={<FileDownloadIcon />}>Export Selected
                    </Button>
                }
                <Button title="Export all existing books to pdf" className={`${styles.button}`}
                    onClick={async () => {
                        exportAll();
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
            showAlertBanner: isLoadingBooksError || isCreateBookError,
            showProgressBars: isRefetchingBooks,
            sorting,
        },
    });

    function openNotificationPopup() {
        let openPopup = false;

        return openPopup;
    }

    return <>
        <MaterialReactTable table={table} />
        <Snackbar
            open={openNotificationPopup()}
            autoHideDuration={10000}
            message={notificationPopupMessage}
        />
    </>;

};
