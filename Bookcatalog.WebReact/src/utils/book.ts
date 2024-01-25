import { getApiUrl } from "config/url";
import { MRT_ColumnFiltersState, MRT_PaginationState, MRT_Row, MRT_SortingState } from "material-react-table";
import moment from "moment";
import { Book } from "types/book";
import { number, object, string } from "yup";
import { Book as BookEntity } from "types/book";

/**
    Prevents MaterialReactTable warnings if there are 'null' results
  **/
export function replaceNullsWithEmptyStrings(bookItems: Array<Book>): Array<Book> {
    return bookItems.map(b => {
        if (b.note === null) {
            b.note = '';
        }

        if (b.author === null) {
            b.author = '';
        }

        if (b.publisher === null) {
            b.publisher = '';
        }

        if (b.collection === null) {
            b.collection = '';
        }

        if (b.category === null) {
            b.category = { id: 0, name: '' };
        }

        if (b.year === null) {
            b.year = 0;
        }

        if (b.read === null) {
            b.read = false;
        }

        if (b.timeOfCreation === null) {
            b.timeOfCreation = '';
        }

        if (b.timeOfLastChange === null) {
            b.timeOfLastChange = '';
        }

        return b;
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
    });

    if (sorting && sorting.length > 0) {
        let showDescAsc = sorting[0].desc ? "desc" : "asc";
        getBooksUrl.searchParams.set('orderBy', `${sorting[0].id} ${showDescAsc}`);
    }

    return getBooksUrl;
}


// TODO: extract values
export const bookValidationSchema = object({
    title: string().required('Title is required.').max(195, `Title maximum length limit is 195`),
    author: string().max(55, `Author maximum length limit is 55`),
    note: string().max(4000, `Note maximum length limit is 4000`),
    publisher: string().max(55, `Publisher maximum length limit is 55`),
    collection: string().max(55, `Collection maximum length limit is 55`),
    year: number().moreThan(0).lessThan(2050).integer('Year must be an integer')
});


/**  
 * On the backend we are useng UTC(Coordinated Universal Time).
 * Here, on the frontend, we are determing how much the current user time zone is offset from UTC
 * so we could calculate it to show it to the user correctly
*/
export const calculateAndformatDateTime = (rowDateTime: string) => {
    if (rowDateTime) {
        let UTCoffset = new Date().getTimezoneOffset();
        let minutesToAdd = UTCoffset * (-1);
        let convertedToDate = new Date(rowDateTime);
        var convertedToRightTimeZone = moment(convertedToDate).add(minutesToAdd, 'm').toDate();

        return `${convertedToRightTimeZone.toLocaleDateString('hr-HR')} ${convertedToRightTimeZone.toLocaleTimeString('hr-HR')}`
    }

    return '';
}


export const getSelectedRowArrayForExport = (row: MRT_Row<BookEntity>) => {
    return [row.original.title ? cutStringIfTooLong(replaceProblematicCaracters(row.original.title), 44) :
        '', row.original.author ? cutStringIfTooLong(replaceProblematicCaracters(row.original.author), 23) : ''];
}

export const getAllRowArrayForExport = (row: BookEntity) => {
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

export const cutStringIfTooLong = (stringToCut: string, maxLength: number) => {
    if (stringToCut.length > maxLength) {
        stringToCut = `${stringToCut.substring(0, maxLength)}...`;
    }

    return stringToCut;
}

export const getCurrentDateForExportTitle = () => {
    const currentDate = new Date();
    return `${currentDate.toLocaleDateString('hr-HR')}`;
}