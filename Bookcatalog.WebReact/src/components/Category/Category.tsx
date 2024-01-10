
import { categoryTableDefaultPageSize } from "config/category";
import { MRT_ColumnDef, MRT_ColumnFiltersState, MRT_PaginationState, MRT_Row, MRT_SortingState, MRT_TableOptions, MaterialReactTable, createRow, useMaterialReactTable } from "material-react-table";
import { useMemo, useState } from "react";
import * as hooks from "data/categoryHooks";
import { Category as CategoryEntity } from "types/category";
import { categoryValidationSchema } from "utils/category";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

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

    const { mutateAsync: create, isPending: isCreatingCategory } =
        hooks.useCreateCategory();

    const { mutateAsync: update, isPending: isUpdatingCategory } =
        hooks.useUpdateCategory();

    const { mutateAsync: deleteCategory, isPending: isDeletingCategory } =
        hooks.useDeleteCategory();

    const { mutateAsync: deleteList, isPending: isDeletingCategoryList } =
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
        table.setEditingRow(null); //exit editing mode
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
        table.setCreatingRow(null); //exit creating mode
    };

    const columns = useMemo<MRT_ColumnDef<CategoryEntity>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                muiEditTextFieldProps: {
                    type: 'email',
                    required: true,
                    error: !!validationErrors?.name,
                    helperText: validationErrors?.name,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            title: undefined,
                        }),
                    //optionally add validation checking for onBlur or onChange
                }
            }
        ],
        [validationErrors],
    );

    const openDeleteConfirmModal = async (row: MRT_Row<CategoryEntity>) => {
        if (window.confirm(`Are you sure you want to delete the book "${row.original.name}"?`)) {
            await deleteCategory(row.original.id);
        }
    };

    const openDeleteListConfirmModal = async (rows: Array<MRT_Row<CategoryEntity>>) => {
        const namesToDelete = rows.map(t => t.original.name);

        // TODO: create modal popup
        if (window.confirm(`Are you sure you want to delete selected categories: "${JSON.stringify(namesToDelete)}"?`)) {
            await deleteList(rows.map(r => +r.id));
        }
    };

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
        muiToolbarAlertBannerProps: isLoadingCategoriesError
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
        onCreatingRowSave: handleCreateCategory,
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleSaveCategory,

        renderTopToolbarCustomActions: ({ table }) => (
            <>
                <Tooltip arrow title="Refresh Data">
                    <IconButton onClick={async () => refetchCategories()}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
                <Button
                    variant="contained"
                    onClick={() => {
                        table.setCreatingRow(
                            createRow(table)
                        );
                    }}
                >
                    New category
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
                    <IconButton onClick={() => {
                        //console.log(JSON.stringify(row.id))
                        setSelectedCategoryId(row.id);
                        table.setEditingRow(row);
                    }}>
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
            isLoading: isLoadingCategories,
            pagination,
            showAlertBanner: isLoadingCategoriesError,
            showProgressBars: isRefetchingCategories,
            sorting,
        },
    });

    return <MaterialReactTable table={table} />;
}

