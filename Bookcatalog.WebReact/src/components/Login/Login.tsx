import { Button } from "@mui/material";
import axios from "axios";
import { loginUrl, getApiUrl } from "config/url";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { setAuthTokenHeader } from "utils/auth";

export const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();


    const handleSubmit = async () => {
        //reqres registered sample user
        const loginPayload = {
            email: 'octopus@yahoo.com',
            password: '2xSNzSa$'
        }

        const response = await axios.post(getApiUrl() + loginUrl, loginPayload);

        const token = response.data.token;
        const refreshToken = response.data.refreshToken;

        localStorage.setItem("bookCatalogToken", token);
        localStorage.setItem("bookCatalogRefreshToken", refreshToken);
        setAuthTokenHeader(token);

        const { redirectTo } = queryString.parse(location.search);

        const redirectLocation: string = redirectTo && typeof redirectTo === 'string' ? redirectTo : "/book";

        navigate(redirectLocation);
    };


    const logOff = async () => {
        localStorage.removeItem("bookCatalogToken");
        localStorage.removeItem("bookCatalogRefreshToken");
    }

    return (
        <>
            <h2>Login page</h2>
            <Button
                variant="contained"
                onClick={() => handleSubmit()}>
                login
            </Button>
            <div />
            <Button
                variant="contained"
                onClick={() => logOff()}>
                logOff
            </Button>
        </>
    )
};