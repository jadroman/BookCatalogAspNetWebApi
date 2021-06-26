import { Category } from "../category.model";

export interface Book{
    id: number;
    title: string;
    year: number;
    publisher: string;
    author: string;
    category: Category;
    note: string;
    collection: string;
    read: boolean;
}