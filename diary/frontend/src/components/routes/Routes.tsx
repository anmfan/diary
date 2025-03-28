import {BrowserRouter, Route, Routes as PageRoutes} from "react-router-dom";
import Layout from "../layout/Layout.tsx";
import PrivateRoutes from "../private-routes/PrivateRoutes.tsx";
import Profile from "../../pages/profile-page/Profile.tsx";
import Diary from '../../pages/diary-page/Diary.tsx';
import {ROUTES_ENDPOINTS} from "./const.ts";

const Routes = () => {
    return (
        <BrowserRouter>
            <PageRoutes>
                <Route path={ROUTES_ENDPOINTS.HOME} element={<Layout />} >
                    <Route index element={<Layout/>}/>
                    <Route path={ROUTES_ENDPOINTS.PROFILE} element={
                        <PrivateRoutes>
                            <Profile/>
                        </PrivateRoutes>
                    }/>
                    <Route path={ROUTES_ENDPOINTS.DIARY} element={
                        <PrivateRoutes>
                            <Diary/>
                        </PrivateRoutes>
                    }/>
                </Route>
            </PageRoutes>
        </BrowserRouter>
    );
};

export default Routes;