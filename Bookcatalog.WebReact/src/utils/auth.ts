import axios from 'axios';
import { getApiUrl, refreshTokenUrl } from 'config/url';

/* type RefreshTokenState = {
    isRefreshed: boolean,
    isComplete: boolean
} */

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
    localStorage.removeItem("refreshingTokenRequested");

    return response;
}, async error => {


    if (error.response.status === 401) {

        if (!localStorage.getItem("refreshingTokenRequested")) {

            localStorage.setItem("refreshingTokenRequested", 'true');

            console.log('axios.interceptor=>response.status === 401');
            const tokenRefreshSuccessful = await refreshToken();

            if (!tokenRefreshSuccessful) {

                //TODO: move to function
                localStorage.removeItem("bookCatalogToken");
                localStorage.removeItem("bookCatalogRefreshToken");
                localStorage.removeItem("bookCatalogUserName");
                localStorage.removeItem("refreshingTokenRequested");

                window.location.href = '#/login';
            }
        }
    }

    return error;
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
            setAuthTokenHeader(newToken);
        }
    }

    return isAuthSuccessful;
}

export const isUserAuthenicated = () => {
    return localStorage.getItem("bookCatalogToken");
    /* if(localStorage.getItem("bookCatalogToken")){
        return true;
    }
    else{
        return false;
    } */
}