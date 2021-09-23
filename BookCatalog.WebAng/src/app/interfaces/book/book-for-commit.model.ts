
export interface BookForCommit{
    id?:number;
    title: string;
    year: number;
    categoryId?: number;
    publisher: string;
    author: string;
    note: string;
    collection: string;
    read: boolean;
}