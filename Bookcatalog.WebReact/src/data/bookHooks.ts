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
            const response = await fetch(getCategoriesUrl.href);
            const json: ApiResponse<Category> = await response.json();

            return json.items;
        },
    });
}

export function useCreateBook() {
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

            return await fetch(putBookUrl, reqOpt);
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
            const reqOpt = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(book)
            };

            const bookUrl = new URL(
                `book/${book.id}`, getApiUrl(),
            );

            return await fetch(bookUrl, reqOpt);
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
            const reqOpt = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            };

            const bookUrl = new URL(
                `book/${id}`, getApiUrl(),
            );

            return await fetch(bookUrl, reqOpt);
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
            const reqOpt = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(idList)
            };

            const bookUrl = new URL(
                `book`, getApiUrl(),
            );

            return await fetch(bookUrl, reqOpt);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['bookData'] })
        },
    });
}