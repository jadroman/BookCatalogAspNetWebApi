import { getApiUrl } from "config/url";
import { MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from "material-react-table";
import { Book } from "types/book";
import { Category } from "types/category";
import { number, object, string } from "yup";

/**
    Prevents MaterialReactTable warnings if there are 'null' results
  **/
export function replaceNullsWithEmptyStrings(categoryItems: Array<Category>): Array<Category> {
    return categoryItems.map(c => {
        if (c.name === null) {
            c.name = '';
        }

        return c;
    });
}

/**
 *  e.g. 'api/book?PageNumber=0&pageSize=10&title=long&author=nick&OrderBy=author+asc'
 * @param columnFilters 
 * @param pagination 
 * @param sorting 
 * @returns 
 */
export function setSearchParams(columnFilters: MRT_ColumnFiltersState, pagination: MRT_PaginationState,
    sorting: MRT_SortingState): URL {

    const getCategoriesUrl = new URL(
        'category', getApiUrl(),
    );

    // URL e.g. api/book?PageNumber=0&pageSize=10&title=long&author=nick&globalFilter=&OrderBy=author+asc

    getCategoriesUrl.searchParams.set('pageNumber', `${pagination.pageIndex}`);
    getCategoriesUrl.searchParams.set('pageSize', `${pagination.pageSize}`);

    columnFilters.forEach((cf) => {
        if (cf.id === 'name') {
            if (cf.value !== '' && typeof cf.value === 'string') {
                getCategoriesUrl.searchParams.set('name', cf.value)
            }
        }
    });

    if (sorting && sorting.length > 0) {
        let showDescAsc = sorting[0].desc ? "desc" : "asc";
        getCategoriesUrl.searchParams.set('orderBy', `${sorting[0].id} ${showDescAsc}`);
    }

    return getCategoriesUrl;
}


// TODO: extract values
export const categoryValidationSchema = object({
    name: string().required('Name is required.').max(47, 'Name maximum length limit is 47')
});