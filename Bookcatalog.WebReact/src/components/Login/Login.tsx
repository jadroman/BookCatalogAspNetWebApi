import { Button } from "@mui/material";
import axios from "axios";
import { loginUrl, getApiUrl } from "config/url";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { setAuthTokenHeader } from "utils/auth";
import styles from './Login.module.scss';
import * as hooks from "data/accountHooks";
import { UserInfo } from "types/authInfo";

export const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();


    const handleSubmit = async () => {
        //reqres registered sample user
        /* const loginPayload = {
            email: 'octopus@yahoo.com',
            password: '2xSNzSa$'
        }

        const response = await axios.post(getApiUrl() + loginUrl, loginPayload); */


        /* const {
            data: user = {},
            isError: isUserLoginError
        } = hooks.useLoginUser();

        const token = user.token;
        const refreshToken = user.refreshToken;

        if (token && refreshToken) {
            localStorage.setItem("bookCatalogToken", token);
            localStorage.setItem("bookCatalogRefreshToken", refreshToken);
            setAuthTokenHeader(token);

            const { redirectTo } = queryString.parse(location.search);
            const redirectLocation: string = redirectTo && typeof redirectTo === 'string' ? redirectTo : "/book";
            navigate(redirectLocation);
        } */

        //console.log(JSON.stringify(user));

        const authInfo = await loginUser();

        const token = authInfo.token;
        const refreshToken = authInfo.refreshToken;
        const userInfo = authInfo.userInfo;

        if (token && refreshToken && userInfo && userInfo.userName) {
            localStorage.setItem("bookCatalogToken", token);
            localStorage.setItem("bookCatalogRefreshToken", refreshToken);
            localStorage.setItem("bookCatalogUserName", userInfo.userName);
            setAuthTokenHeader(token);

            const { redirectTo } = queryString.parse(location.search);
            const redirectLocation: string = redirectTo && typeof redirectTo === 'string' ? redirectTo : "/book";
            navigate(redirectLocation);
        }
    };


    const logOff = async () => {
        localStorage.removeItem("bookCatalogToken");
        localStorage.removeItem("bookCatalogRefreshToken");
        localStorage.removeItem("bookCatalogUserName");
    }

    const { mutateAsync: loginUser, isError: isLoginUserError } =
        hooks.useLoginUser();

    return (
        <>

            <div className={styles.loginWrapper}>
                <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                <div className="form-floating">
                    <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                    <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                    <label htmlFor="floatingPassword">Password</label>
                </div>

                <div className="checkbox mb-3">
                    <label>
                        <input type="checkbox" value="remember-me" /> Remember me
                    </label>
                </div>
                <button className="w-100 btn btn-lg btn-primary" onClick={async () => handleSubmit()}>Sign in</button>
                <p className="mt-5 mb-3 text-muted">&copy; 2017–2021</p>
                <Button
                    variant="contained"
                    onClick={() => logOff()}>
                    logOff
                </Button>
            </div>

            {/* <h2>Login page</h2>
            <Button
                variant="contained"
                onClick={async () => handleSubmit()}>
                login
            </Button>
            <div />
            <Button
                variant="contained"
                onClick={() => logOff()}>
                logOff
            </Button> */}
        </>
    )
};