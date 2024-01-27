import { getApiUrl } from "config/url";
import { MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from "material-react-table";
import { Category } from "types/category";
import { object, string } from "yup";

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
 *  Generates url, e.g. 'api/category?PageNumber=0&pageSize=10&title=long&author=nick&OrderBy=author+asc'
 */
export function setSearchParams(columnFilters: MRT_ColumnFiltersState, pagination: MRT_PaginationState,
    sorting: MRT_SortingState): URL {

    const getCategoriesUrl = new URL(
        'category', getApiUrl(),
    );

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

export const categoryValidationSchema = object({
    name: string().required('Name is required.').max(47, 'Name maximum length limit is 47')
});