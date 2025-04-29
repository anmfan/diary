import styles from '../header-auth/header-auth.module.css';
import {ROUTES_ENDPOINTS} from "../routes/const.tsx";
import {logout} from "@/redux/thunks/user-thunk.ts";
import {useAppDispatch} from "@/hooks/store.ts";
import {useNavigate} from "react-router-dom";
import {UsersRoles} from "@/redux/slices/user-slice.ts";
import {UserRole} from "@/redux/types.ts";


const HeaderDropdownMenu = ({role}: {role: UserRole}) => {
    const dispatch = useAppDispatch();
    const nav = useNavigate();

    const exit = () => {
        dispatch(logout());
    }

    const handleRedirect = (page: string) => {
        return nav(page)
    }

    return (
        <div className={styles.dropdownMenu}>
            <ul className={styles.user_list}>
                <li onClick={() => handleRedirect(ROUTES_ENDPOINTS.PROFILE)}>
                    <span>Профиль</span>
                </li>
                {(role === UsersRoles.admin || role === UsersRoles.teacher)
                    && (
                    <li onClick={() => handleRedirect(ROUTES_ENDPOINTS.MANAGEMENT)}>
                        <span>Управление</span>
                    </li>
                )}
                <li onClick={() => handleRedirect(ROUTES_ENDPOINTS.SETTINGS)}>
                    <span>Настройки</span>
                </li>
                <li onClick={exit}><span>Выйти</span></li>
            </ul>
        </div>
    );
};

export default HeaderDropdownMenu;