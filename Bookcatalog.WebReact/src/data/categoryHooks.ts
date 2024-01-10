import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "config/url";
import { MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from "material-react-table";
import { Book } from "types/book";
import { Category } from "types/category";
import { ApiData, ApiResponse } from "types/shared";
import { replaceNullsWithEmptyStrings, setSearchParams } from "utils/category";
import axios from "axios";

export function useGetCategories(columnFilters: MRT_ColumnFiltersState, globalFilter: string,
    pagination: MRT_PaginationState, sorting: MRT_SortingState) {

    const query = useQuery<ApiData<Category>>({
        queryKey: [
            'categoryData',
            columnFilters, //refetch when columnFilters changes
            globalFilter, //refetch when globalFilter changes
            pagination.pageIndex, //refetch when pagination.pageIndex changes
            pagination.pageSize, //refetch when pagination.pageSize changes
            sorting, //refetch when sorting changes
        ],
        queryFn: async (): Promise<ApiData<Category>> => {
            const getCategoriesUrl = setSearchParams(columnFilters, pagination, sorting);

            const response = await axios.get(getCategoriesUrl.href);

            const json: ApiResponse<Category> = (response).data;
            return { items: replaceNullsWithEmptyStrings(json.items), metaData: json.metaData };
        },
        placeholderData: keepPreviousData
    });

    return query;
}

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (category: Category) => {
            await axios.post(`${getApiUrl()}category`, category);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['categoryData'] })
        },
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (category: Category) => {
            await axios.put(`${getApiUrl()}category/${category.id}`, category);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['categoryData'] })
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`${getApiUrl()}category/${id}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['categoryData'] })
        },
    });
}

export function useDeleteCategoryList() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (idList: Array<number>) => {
            await axios.delete(`${getApiUrl()}category`, { data: idList });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['categoryData'] })
        },
    });
}