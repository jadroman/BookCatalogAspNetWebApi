import { Category } from "./category"

export type Book = {
    id: number,
    title?: string,
    author?: string,
    category?: Category,
    categoryId?: string,
    note?: string,
    publisher?: string,
    collection?: string,
    read?: boolean,
    year?: number
}
