import { setAuthTokenHeader } from "utils/auth";
import styles from './Login.module.scss';
import * as hooks from "data/accountHooks";
import { useFormik } from "formik";
import { Login as LoginType } from "types/authInfo";
import { loginValidationSchema } from "utils/login";
import bookShelf from 'images/bookshelf.png';

type LoginProps = {
    onUserIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const Login = (props: LoginProps) => {

    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        onSubmit: async values => {
            await handleSubmit(values.username, values.password);
        },
        validationSchema: loginValidationSchema
    });

    const handleSubmit = async (username: string, password: string) => {

        const loginData: LoginType = { username: username, password: password };
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
                <img
                    src={bookShelf}
                    width="60"
                    height="60"
                    className="mb-3 d-inline-block align-top"
                    alt="logo"
                />
                <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
                <div className="form-floating">
                    <input type="text" className="form-control" id="username" placeholder="username"
                        onChange={formik.handleChange} value={formik.values.username} />
                    <label htmlFor="username">Username</label>
                    {formik.touched.username && formik.errors.username ? (
                        <div className={styles.inputError}>{formik.errors.username}</div>
                    ) : null}
                </div>
                <div className="form-floating mt-1">
                    <input type="password" className="form-control" id="password" placeholder="Password"
                        onChange={formik.handleChange} value={formik.values.password} />
                    <label htmlFor="password">Password</label>
                    {formik.touched.password && formik.errors.password ? (
                        <div className={styles.inputError}>{formik.errors.password}</div>
                    ) : null}
                </div>
                <button className=" mt-3 w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
            </div>
        </form>
    )
};