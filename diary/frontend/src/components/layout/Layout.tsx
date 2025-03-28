import Header from "../header/Header.tsx";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <Header />
            <Outlet/>
        </>
    );
};

export default Layout;