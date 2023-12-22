import { Button } from "@mui/material";
import axios from "axios";
import { authUrl, getApiUrl } from "config/url";
import { setAuthToken } from "utils/auth";

const handleSubmit = async () => {
    //reqres registered sample user
    const loginPayload = {
        email: 'octopus@yahoo.com',
        password: '2xSNzSa$'
    }

    const response = await axios.post(getApiUrl() + authUrl, loginPayload);

    const token = response.data.token;

    localStorage.setItem("bookCatalogToken", token);
    setAuthToken(token);
    //window.location.href = '/';
};


const logOff = async () => {
    localStorage.removeItem("bookCatalogToken");
}

export const Login = () => {
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