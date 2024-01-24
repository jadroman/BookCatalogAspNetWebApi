import axios from 'axios';
import { refreshToken } from './auth';

export const interceptors = () => {
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

            const tokenRefreshSuccessful = await refreshToken();

            if (!tokenRefreshSuccessful) {
                localStorage.removeItem("bookCatalogToken");
                localStorage.removeItem("bookCatalogRefreshToken");
                localStorage.removeItem("bookCatalogUserName");
                localStorage.removeItem("refreshingTokenRequested");

                window.location.hash = '/login'
            }
        }
    }

    return error;
});