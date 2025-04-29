import { ReactNode } from 'react';
import useAuth from "@/hooks/useAuth.tsx";
import {Navigate, useLocation} from "react-router-dom";
import {ROUTES_ENDPOINTS} from "../routes/const.tsx";

type PrivateRouteProps = {
    children: ReactNode;
}

const PrivateRoutes = ({children}: PrivateRouteProps) => {
    const hasAccess = useAuth();
    const location = useLocation();
    const pathToLoginPage = location.pathname === ROUTES_ENDPOINTS.AUTH;

    if (hasAccess && pathToLoginPage) {
        const from = location.state?.from || ROUTES_ENDPOINTS.HOME;
        return <Navigate to={from}/>
    }

    if (!hasAccess && !pathToLoginPage) {
        return <Navigate to={ROUTES_ENDPOINTS.AUTH} state={{from: location}} />;
    }

    return children;
};

export default PrivateRoutes;