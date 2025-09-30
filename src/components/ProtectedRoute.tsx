import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = () => {
    const { accessToken } = useAuth();

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;

}

export default ProtectedRoute;