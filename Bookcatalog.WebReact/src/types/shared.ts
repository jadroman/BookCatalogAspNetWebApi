
export type ApiData<Type> = {
    items: Array<Type>;
    metaData: {
        totalCount: number;
    };
};

export type ApiResponse<Type> = {
    items: Array<Type>;
    metaData: {
        totalCount: number;
    };
};

export enum TableEditStatus { 'update', 'insert' };