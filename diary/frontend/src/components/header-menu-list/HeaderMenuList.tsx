import { HEADER_LIST_ITEMS } from "../header/const.tsx";
import styles from "../header/header.module.css";
import HeaderAuth from "@/components/header-auth/HeaderAuth.tsx";
import HeaderGuest from "@/components/header-guest/HeaderGuest.tsx";
import useAuth from "@/hooks/useAuth.tsx";
import HeaderMenuListItem from "@/components/header-menu-list-item/HeaderMenuListItem.tsx";

const HeaderMenuList = () => {
    const isAuth = useAuth();

    return (
        <ul className={styles.list}>
            {HEADER_LIST_ITEMS.map((item) => (
                <HeaderMenuListItem key={item.id} {...item}/>
            ))}
            {isAuth && <HeaderAuth/>}
            {!isAuth && <HeaderGuest/>}
        </ul>
    );
};

export default HeaderMenuList;