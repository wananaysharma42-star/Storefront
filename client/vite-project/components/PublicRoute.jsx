import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

export const PublicRoute = ({ children }) => {
    const { customer, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
            </div>
        );
    }

    if (customer) {
        return <Navigate to="/home" replace />;
    }

    return children;
};