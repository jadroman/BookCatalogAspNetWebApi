
import { categoryTableDefaultPageSize } from "config/category";
import {
    MRT_ColumnDef, MRT_ColumnFiltersState, MRT_PaginationState, MRT_Row, MRT_SortingState, MRT_TableOptions,
    MaterialReactTable, createRow, useMaterialReactTable
} from "material-react-table";
import { useMemo, useState } from "react";
import * as hooks from "data/categoryHooks";
import { Category as CategoryEntity } from "types/category";
import { categoryValidationSchema } from "utils/category";
import { AlertProps, Box, Button, IconButton, Tooltip } from "@mui/material";
import { Button as BootstrapButton } from "react-bootstrap";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { refreshToken } from "utils/auth";
import styles from "./Category.module.scss"

export const Category = () => {
    const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('0');
    const [disableSaveOnInsert, setDisableSaveOnInsert] = useState<boolean>(false);

    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([],);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: categoryTableDefaultPageSize,
    });

    const {
        data: { items = [], metaData = { totalCount: 0 } } = {},
        isError: isLoadingCategoriesError,
        isRefetching: isRefetchingCategories,
        isLoading: isLoadingCategories,
        refetch: refetchCategories,
    } = hooks.useGetCategories(columnFilters, globalFilter,
        pagination, sorting);

    const { mutateAsync: create, isError: isCreateCategoryError } =
        hooks.useCreateCategory();

    const { mutateAsync: update, isError: isUpdateCategoryError } =
        hooks.useUpdateCategory();

    const { mutateAsync: deleteCategory, isError: isDeleteCategoryError } =
        hooks.useDeleteCategory();

    const { mutateAsync: deleteList, isError: isDeleteCategoryListError } =
        hooks.useDeleteCategoryList();

    const handleSaveCategory: MRT_TableOptions<CategoryEntity>['onEditingRowSave'] = async ({
        values,
        table
    }) => {
        values.id = selectedCategoryId;
        let validationErrorsObj: any = {};
        let errorsMap = new Map();

        await categoryValidationSchema.validate(values, { abortEarly: false }).then(v => {
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

    const handleCreateCategory: MRT_TableOptions<CategoryEntity>['onCreatingRowSave'] = async ({
        values,
        table,
    }) => {
        // prevents the user to hit 'save' several times in a row and to insert duplicate records
        if (disableSaveOnInsert)
            return;

        setDisableSaveOnInsert(true);
        let validationErrorsObj: any = {};
        let errorsMap = new Map();

        await categoryValidationSchema.validate(values, { abortEarly: false }).then(v => {
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

    const columns = useMemo<MRT_ColumnDef<CategoryEntity>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                muiEditTextFieldProps: {
                    type: 'text',
                    inputProps: { autoComplete: 'off' },
                    required: true,
                    error: !!validationErrors?.name,
                    helperText: validationErrors?.name,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            name: undefined,
                        })
                },
                muiFilterTextFieldProps: {
                    inputProps: { autoComplete: 'off' }
                }
            }
        ],
        [validationErrors]
    );

    const openDeleteConfirmModal = async (row: MRT_Row<CategoryEntity>) => {
        if (window.confirm(`Are you sure you want to delete the category "${row.original.name}"?`)) {
            await deleteCategory(row.original.id);
        }
    };

    const openDeleteListConfirmModal = async (rows: Array<MRT_Row<CategoryEntity>>) => {
        const namesToDelete = rows.map(t => t.original.name);

        if (window.confirm(`Are you sure you want to delete selected categories: "${JSON.stringify(namesToDelete)}"?`)) {
            await deleteList(rows.map(r => +r.id));
        }
    };

    const getTableToolbarAlertProps = () => {
        let errorLabel = '';

        if (isLoadingCategoriesError)
            errorLabel += 'An error accured while loading data. ';

        if (isCreateCategoryError)
            errorLabel += 'An error accured while creating a category. ';

        if (isUpdateCategoryError)
            errorLabel += 'An error accured while updating a category. ';

        if (isDeleteCategoryError)
            errorLabel += 'An error accured while deleting a category. ';

        if (isDeleteCategoryListError)
            errorLabel += 'An error accured while deleting a list of categories. ';

        if (isLoadingCategoriesError || isCreateCategoryError || isUpdateCategoryError || isDeleteCategoryError || isDeleteCategoryListError)
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
        onCreatingRowSave: handleCreateCategory,
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleSaveCategory,

        renderTopToolbarCustomActions: ({ table }) => (
            <div className={styles.gridToolbarWrapper}>
                <Tooltip arrow title="Refresh Data">
                    <IconButton onClick={async () => refetchCategories()}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
                <Button
                    variant="contained"
                    onClick={async () => {
                        await refreshToken();
                        table.setCreatingRow(createRow(table));
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
                        }}>
                        Delete selected
                    </BootstrapButton>
                }
            </div>
        ),
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip title="Edit">
                    <IconButton onClick={async () => {
                        await refreshToken();
                        setSelectedCategoryId(row.id);
                        table.setEditingRow(row);
                    }}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton color="error" onClick={async () => {
                        await refreshToken();
                        openDeleteConfirmModal(row);
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
            isLoading: isLoadingCategories,
            pagination,
            showAlertBanner: isLoadingCategoriesError,
            showProgressBars: isRefetchingCategories,
            sorting,
        },
    });

    return <MaterialReactTable table={table} />;
}

