import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
    children?: JSX.Element
}

export const ProtectedRoute = (props: ProtectedRouteProps) => {
    const isAuthenticated = localStorage.getItem("bookCatalogToken");

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return props.children ? props.children : <Outlet />
};