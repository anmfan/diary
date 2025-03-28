import {ReactNode} from 'react';

type PrivateRouteProps = {
    children: ReactNode
}

const PrivateRoutes = ({children}: PrivateRouteProps) => {
    if (isAuth) return children;
    return AuthPage;
};

export default PrivateRoutes;