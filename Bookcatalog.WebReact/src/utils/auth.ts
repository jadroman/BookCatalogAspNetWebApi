import axios from 'axios';
import { getApiUrl, refreshTokenUrl } from 'config/url';

export const setAuthTokenHeader = (token: string) => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    else
        delete axios.defaults.headers.common["Authorization"];
}

export const refreshToken = async () => {

    var isAuthSuccessful = false;
    const expiredToken = localStorage.getItem("bookCatalogToken");
    const refreshToken = localStorage.getItem("bookCatalogRefreshToken");

    if (expiredToken && refreshToken) {

        const refreshTokenPayload = {
            expiredToken: expiredToken,
            refreshToken: refreshToken
        };

        const response = await axios.post(getApiUrl() + refreshTokenUrl, refreshTokenPayload);

        isAuthSuccessful = response.data.isAuthSuccessful;

        if (isAuthSuccessful) {
            const newToken = response.data.token;

            localStorage.setItem("bookCatalogToken", newToken);
            setAuthTokenHeader(newToken);
        }
    }

    return isAuthSuccessful;
}

export const isUserAuthenicated = (): boolean => {
    return localStorage.getItem("bookCatalogToken") !== '' && localStorage.getItem("bookCatalogToken") !== null;
}