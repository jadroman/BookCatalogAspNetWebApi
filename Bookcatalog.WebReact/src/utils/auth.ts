import axios from 'axios';
import { getApiUrl, refreshTokenUrl } from 'config/url';

export const setAuthTokenHeader = (token: string) => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    else
        delete axios.defaults.headers.common["Authorization"];
}

axios.interceptors.response.use(response => {
    return response;
}, async error => {
    if (error.response.status === 401) {
        console.log('axios.interceptor');


        /* const expiredToken = localStorage.getItem("bookCatalogToken");
        const refreshToken = localStorage.getItem("bookCatalogRefreshToken");

        if (expiredToken && refreshToken) {

            const refreshTokenPayload = {
                token: expiredToken,
                refreshToken: refreshToken
            };

            const response = await axios.post(getApiUrl() + refreshTokenUrl, refreshTokenPayload);

            const newToken = response.data.token;
            const newRefreshToken = response.data.refreshToken;

            localStorage.setItem("bookCatalogToken", newToken);
            localStorage.setItem("bookCatalogRefreshToken", newRefreshToken);
            setAuthTokenHeader(newToken);
        } */



    }
    return error;
});