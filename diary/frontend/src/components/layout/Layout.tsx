import Header from "../header/Header.tsx";
import { Outlet } from "react-router-dom";
import {Suspense} from "react";
import Spinner from "../spinner/Spinner.tsx";

const Layout = () => {
    return (
        <>
            <Header />
            <Suspense fallback={<Spinner/>}>
                <Outlet/>
            </Suspense>
        </>
    );
};

export default Layout;