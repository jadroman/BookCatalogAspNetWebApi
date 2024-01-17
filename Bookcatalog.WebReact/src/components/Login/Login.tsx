import { Button } from "@mui/material";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { setAuthTokenHeader } from "utils/auth";
import styles from './Login.module.scss';
import * as hooks from "data/accountHooks";
import { useFormik } from "formik";
import { Login as LoginType } from "types/authInfo";

type LoginProps = {
    onUserIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const Login = (props: LoginProps) => {

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        onSubmit: async values => {
            await handleSubmit(values.email, values.password);
        },
    });

    const handleSubmit = async (email: string, password: string) => {

        const loginData: LoginType = { username: email, password: password };
        const authInfo = await loginUser(loginData);

        //console.log(isLoginUserError);

        if (authInfo) {

            const token = authInfo.token;
            const refreshToken = authInfo.refreshToken;
            const userInfo = authInfo.userInfo;

            if (token && refreshToken && userInfo && userInfo.userName) {
                localStorage.setItem("bookCatalogToken", token);
                localStorage.setItem("bookCatalogRefreshToken", refreshToken);
                localStorage.setItem("bookCatalogUserName", userInfo.userName);
                setAuthTokenHeader(token);
                props.onUserIsAuthenticated(true);
                window.location.hash = '/book';
            }
        }
        else {

            console.log('login error');
        }
    };

    const { mutateAsync: loginUser } =
        hooks.useLoginUser();

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className={styles.loginWrapper}>
                <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                <div className="form-floating">
                    <input type="email" className="form-control" id="email" placeholder="Email"
                        onChange={formik.handleChange} value={formik.values.email} />
                    <label htmlFor="email">Email address</label>
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control" id="password" placeholder="Password"
                        onChange={formik.handleChange} value={formik.values.password} />
                    <label htmlFor="password">Password</label>
                </div>
                <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
            </div>
        </form>
    )
};