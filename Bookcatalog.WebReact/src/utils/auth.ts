import axios from 'axios';
import { getApiUrl, refreshTokenUrl } from 'config/url';

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
    localStorage.removeItem("refreshingTokenRequested");

    return response;
}, async error => {
    if (error.response?.status === 401) {
        if (!localStorage.getItem("refreshingTokenRequested")) {
            localStorage.setItem("refreshingTokenRequested", 'true');
            const tokenRefreshSuccessful = await refreshToken();

            if (!tokenRefreshSuccessful) {
                localStorage.removeItem("bookCatalogToken");
                localStorage.removeItem("bookCatalogRefreshToken");
                localStorage.removeItem("bookCatalogUserName");
                localStorage.removeItem("refreshingTokenRequested");
                window.location.hash = '/login'
            }
        }
        return error;
    }
    else {
        return Promise.reject(error);
    }
});

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
        }
    }

    return isAuthSuccessful;
}

export const isUserAuthenicated = (): boolean => {
    return localStorage.getItem("bookCatalogToken") !== null && localStorage.getItem("bookCatalogToken") !== '';
}