import {BrowserRouter, Route, Routes as PageRoutes} from "react-router-dom";
import Layout from "../layout/Layout.tsx";
import PrivateRoutes from "../private-routes/PrivateRoutes.tsx";
import {ROUTES, ROUTES_ENDPOINTS} from "./const.tsx";
import NotFound from "@/pages/not-found-page/NotFound.tsx";
import Home from "@/pages/home-page/Home.tsx";

const Routes = () => {
    return (
        <BrowserRouter>
            <PageRoutes>
                <Route path={ROUTES_ENDPOINTS.HOME} element={<Layout/>}>
                    <Route index element={<Home/>}/>
                    {ROUTES.map((route) => (
                        <Route key={route.id} path={route.path} element={
                            <PrivateRoutes>
                                {route.element}
                            </PrivateRoutes>
                        }/>
                    ))}
                </Route>
                <Route path={ROUTES_ENDPOINTS.NOT_FOUND} element={<NotFound/>} />
            </PageRoutes>
        </BrowserRouter>
    );
};

export default Routes;