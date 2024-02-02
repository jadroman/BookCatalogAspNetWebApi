import { Category } from "./category";

export type CategorySelectionProps = {
    inputData: Array<Category>;
    selectedCategory?: string;
    onSelectCategory: (selectedCategory: string) => void;
};

export type LoginProps = {
    onUserIsAuthenticated: () => void;
}