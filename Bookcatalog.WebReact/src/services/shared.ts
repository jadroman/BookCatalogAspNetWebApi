import { Book } from "types/book";

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
            b.category = { id: '0', name: '' };
        }

        if (b.year === null) {
            b.year = 0;
        }

        if (b.read === null) {
            b.read = false;
        }

        return b;
    });
}