
export interface BookForCreation{
    title: string;
    year: number;
    categoryId?: number;
    publisher: string;
    author: string;
    note: string;
    collection: string;
    read: boolean;
}