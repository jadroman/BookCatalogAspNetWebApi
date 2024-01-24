import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryItemsDefaultPageSize } from "config/book";
import { getApiUrl } from "config/url";
import { MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from "material-react-table";
import { Book } from "types/book";
import { Category } from "types/category";
import { ApiData, ApiResponse } from "types/shared";
import { replaceNullsWithEmptyStrings, setSearchParams } from "utils/book";
import axios from "axios";

export function useGetBooks(columnFilters: MRT_ColumnFiltersState, globalFilter: string,
    pagination: MRT_PaginationState, sorting: MRT_SortingState) {

    const query = useQuery<ApiData<Book>>({
        queryKey: [
            'bookData',
            columnFilters, //refetch when columnFilters changes
            globalFilter, //refetch when globalFilter changes
            pagination.pageIndex, //refetch when pagination.pageIndex changes
            pagination.pageSize, //refetch when pagination.pageSize changes
            sorting, //refetch when sorting changes
        ],
        queryFn: async (): Promise<ApiData<Book>> => {
            const getBooksUrl = setSearchParams(columnFilters, pagination, sorting);
            //const response = await fetch(getBooksUrl.href);

            const response = await axios.get(getBooksUrl.href);

            const json: ApiResponse<Book> = (response).data;
            return { items: replaceNullsWithEmptyStrings(json.items), metaData: json.metaData };
        },
        placeholderData: keepPreviousData
    });


    return query;
}


export async function useGetAllBooks() {
    const getBooksUrl = new URL(
        'book\\all', getApiUrl(),
    );

    const response = await axios.get(getBooksUrl.href);

    const json: Array<Book> = (response).data;
    return json;
}

export function useGetCategories() {
    return useQuery<Array<Category>>({
        queryKey: [
            'categoryData'
        ],
        queryFn: async (): Promise<Array<Category>> => {

            const getCategoriesUrl = new URL(
                'category', getApiUrl(),
            );

            getCategoriesUrl.searchParams.set('pageSize', categoryItemsDefaultPageSize);

            const response = await axios.get(getCategoriesUrl.href);

            const json: ApiResponse<Category> = (response).data;
            return json.items;
        },
    });
}

export function useCreateBook() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (book: Book) => {
            await axios.post(`${getApiUrl()}book`, book);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['bookData'] })
        },
    });
}

export function useUpdateBook() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (book: Book) => {
            await axios.put(`${getApiUrl()}book/${book.id}`, book);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['bookData'] })
        },
    });
}

export function useDeleteBook() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`${getApiUrl()}book/${id}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['bookData'] })
        },
    });
}

export function useDeleteBookList() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (idList: Array<number>) => {
            await axios.delete(`${getApiUrl()}book`, { data: idList });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['bookData'] })
        },
    });
}