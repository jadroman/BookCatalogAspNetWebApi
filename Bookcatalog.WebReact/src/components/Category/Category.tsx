
import axios from "axios";
import { getApiUrl, refreshTokenUrl } from "config/url";
import { useNavigate } from "react-router-dom";
import { setAuthTokenHeader } from "utils/auth";

export const Category = () => {
    const login = () => {
        navigate("/login");
    }

    const refresh = async () => {
        const expiredToken = localStorage.getItem("bookCatalogToken");
        const refreshToken = localStorage.getItem("bookCatalogRefreshToken");

        if (expiredToken && refreshToken) {

            const refreshTokenPayload = {
                expiredToken: expiredToken,
                refreshToken: refreshToken
            };

            const response = await axios.post(getApiUrl() + refreshTokenUrl, refreshTokenPayload);

            const newToken = response.data.token;
            const newRefreshToken = response.data.refreshToken;

            localStorage.setItem("bookCatalogToken", newToken);
            localStorage.setItem("bookCatalogRefreshToken", newRefreshToken);
            setAuthTokenHeader(newToken);
        }

    }

    const navigate = useNavigate();
    return <>
        <h2>Category page</h2>
        <div>
            <button onClick={login} type="button" >
                login
            </button>
        </div>
        <div>
            <button onClick={refresh} type="button" >
                refresh token
            </button>
        </div>
    </>
}

