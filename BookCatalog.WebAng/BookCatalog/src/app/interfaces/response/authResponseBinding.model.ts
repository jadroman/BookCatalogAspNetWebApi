export interface AuthResponseBinding {
    isAuthSuccessful: boolean;
    errorMessage: string;
    token: string;
}