//export function bla() { }

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "config/url";
import { MRT_ColumnFiltersState, MRT_PaginationState, MRT_Row, MRT_SortingState, MRT_TableInstance, createRow } from "material-react-table";
import { useState } from "react";
import { replaceNullsWithEmptyStrings } from "services/shared";
import { Book as BookEntity } from "types/book";
import { Category } from "types/category";
import { ApiData, ApiResponse } from "types/shared";
import { Book } from "./Book";
import { ColumnFiltersState, Updater } from "@tanstack/react-table";

export const BookDataWrapper = () => {

    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([],);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const {
        data: { items = [], metaData = { totalCount: 0 } } = {},
        isError: isLoadingBooksError,
        isRefetching: isRefetchingBooks,
        isLoading: isLoadingBooks,
        refetch: refetchBook,
    } = useGetBooks();

    const bookApiData: ApiData<BookEntity> = { items: items, metaData: metaData };

    const onUpdateBook = async (values: any): Promise<void> => {
        await updateBook(values);
    }

    const onCreateBook = async (values: any): Promise<void> => {
        await createBook(values);
    }

    const onDeleteBook = async (values: any): Promise<void> => {
        await deleteBook(values);
    }

    const onDeleteBookList = async (idList: Array<number>): Promise<void> => {
        await deleteBookList(idList);
    }

    const onRefetchBook = async (): Promise<void> => {
        await refetchBook();
    }

    const onCreateRow = (table: MRT_TableInstance<BookEntity>, book: BookEntity): MRT_Row<BookEntity> => {
        return createRow(table, book);
    }

    const onColumnFiltersChange = (filters: Updater<ColumnFiltersState>): void => {
        setColumnFilters(filters);
    }

    const onGlobalFilterChange = (filters: any): void => {
        setGlobalFilter(filters);
    }

    const onPaginationChange = (filters: Updater<MRT_PaginationState>): void => {
        setPagination(filters);
    }

    const onSortingChange = (filters: Updater<MRT_SortingState>): void => {
        setSorting(filters);
    }

    function useGetBooks() {
        return useQuery<ApiData<BookEntity>>({
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
                const json: ApiResponse<BookEntity> = await response.json();


                return { items: replaceNullsWithEmptyStrings(json.items), metaData: json.metaData } as ApiData<BookEntity>;
            },
            placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
        });
    }

    function useGetCategories() {
        return useQuery<Array<Category>>({
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
                const json: ApiResponse<Category> = await response.json();

                return json.items;
            },
        });
    }

    const { mutateAsync: createBook, isPending: isCreatingBook } =
        useCreateBook();

    const { mutateAsync: updateBook, isPending: isUpdatingBook } =
        useUpdateBook();

    function useCreateBook() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (book: BookEntity) => {
                const reqOpt = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(book)
                };

                const putBookUrl = new URL(
                    `book`, getApiUrl(),
                );

                return fetch(putBookUrl, reqOpt);
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ['bookData'] })
            },
        });
    }

    function useUpdateBook() {

        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (book: BookEntity) => {
                const reqOpt = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(book)
                };

                const bookUrl = new URL(
                    `book/${book.id}`, getApiUrl(),
                );

                return fetch(bookUrl, reqOpt);
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ['bookData'] })
            },
        });
    }


    function useDeleteBook() {

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

                return fetch(bookUrl, reqOpt);
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ['bookData'] })
            },
        });
    }

    function useDeleteBookList() {

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

                return fetch(bookUrl, reqOpt);
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ['bookData'] })
            },
        });
    }


    const {
        data: categoryItems = [],
        isError: isErrorCategorySelectItems,
        isLoading: isLoadingCategorySelectItems,
    } = useGetCategories();


    const { mutateAsync: deleteBook, isPending: isDeletingBook } =
        useDeleteBook();

    const { mutateAsync: deleteBookList, isPending: isDeletingBookList } =
        useDeleteBookList();

    return (
        <Book onUpdateBook={onUpdateBook} onCreateBook={onCreateBook} onDeleteBook={onDeleteBook} onCreateRow={onCreateRow}
            onDeleteBookList={onDeleteBookList} bookApiData={bookApiData} onRefetchBook={onRefetchBook}
            categoryItems={categoryItems} isLoadingBooks={isLoadingBooks} isLoadingBooksError={isLoadingBooksError}
            onColumnFiltersChange={onColumnFiltersChange} onGlobalFilterChange={onGlobalFilterChange} isRefetchingBooks={isRefetchingBooks}
            onPaginationChange={onPaginationChange} onSortingChange={onSortingChange} />
    );
}