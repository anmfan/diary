import { ReactNode } from 'react';
import useAuth from "@/hooks/useAuth.tsx";
import {Navigate, useLocation} from "react-router-dom";
import {ROUTES_ENDPOINTS} from "../routes/const.tsx";
import {useAppSelector} from "@/hooks/store.ts";
import {userRole} from "@/redux/selectors/user-selector.ts";
import {UsersRoles} from "@/redux/slices/user-slice.ts";

type PrivateRouteProps = {
    children: ReactNode;
}

const PrivateRoutes = ({children}: PrivateRouteProps) => {
    const hasAccess = useAuth();
    const role = useAppSelector(userRole)
    const location = useLocation();
    const pathToLoginPage = location.pathname === ROUTES_ENDPOINTS.AUTH;
    const pathToManagementPage = location.pathname === ROUTES_ENDPOINTS.MANAGEMENT;

    if (hasAccess && pathToLoginPage) {
        const from = location.state?.from || ROUTES_ENDPOINTS.HOME;
        return <Navigate to={from}/>
    }

    if (!hasAccess && !pathToLoginPage) {
        return <Navigate to={ROUTES_ENDPOINTS.AUTH} state={{from: location}} />;
    }

    if (role === UsersRoles.student && pathToManagementPage) {
        return <Navigate to={ROUTES_ENDPOINTS.HOME} />;
    }

    return children;
};

export default PrivateRoutes;