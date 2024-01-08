import axios from 'axios';
import { getApiUrl, refreshTokenUrl } from 'config/url';
import { useLocation } from 'react-router-dom';

export const setAuthTokenHeader = (token: string) => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    else
        delete axios.defaults.headers.common["Authorization"];
}

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("bookCatalogToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    else {
        config.headers.Authorization = null;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    return response;
}, async error => {

    if (error.response.status === 401) {
        console.log('axios.interceptor=>response.status === 401');
        const tokenRefreshSuccessful = await tryToRefreshToken();

        if (!tokenRefreshSuccessful) {

            //TODO: move to function
            localStorage.removeItem("bookCatalogToken");
            localStorage.removeItem("bookCatalogRefreshToken");

            window.location.href = '/login';
        }
    }
    return error;
});

export const tryToRefreshToken = async () => {

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
            const newRefreshToken = response.data.refreshToken;

            localStorage.setItem("bookCatalogToken", newToken);
            localStorage.setItem("bookCatalogRefreshToken", newRefreshToken);
            setAuthTokenHeader(newToken);
        }
    }

    return isAuthSuccessful;
}