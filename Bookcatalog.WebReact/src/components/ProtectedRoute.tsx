import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
    children?: JSX.Element
}

export const ProtectedRoute = (props: ProtectedRouteProps) => {
    //const prevLocation = useLocation();
    //const redirectLocation = `/login?redirectTo=${prevLocation.pathname}`;

    //TODO: set some expiration 
    const isAuthenticated = localStorage.getItem("bookCatalogToken");

    if (!isAuthenticated) {
        //return <Navigate to={redirectLocation} replace />;
    }

    return props.children ? props.children : <Outlet />
};