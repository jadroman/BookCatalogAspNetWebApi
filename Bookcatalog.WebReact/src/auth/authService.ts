import axios from "axios";
import { loginUrl } from "config/url";

const tokenKeyName = 'bookCatalogToken';

/* export async function login(email: string, password: string) {
    const response = await axios
        .post(authUrl, {
            email,
            password
        });
    if (response.data.token) {
        localStorage.setItem(tokenKeyName, JSON.stringify(response.data.token));
    }
    return response.data;
} */