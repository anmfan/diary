import styles from "@/components/header/header.module.css";
import {NavLink} from "react-router-dom";
import {IHeaderListItems} from "@/components/header/const.tsx";
import {useAppSelector} from "@/hooks/store.ts";
import {userRole} from "@/redux/selectors/user-selector.ts";
import {UsersRoles} from "@/redux/slices/user-slice.ts";

const HeaderMenuListItem = (
    { id, title, path, icon, skip }: IHeaderListItems) => {
    const role = useAppSelector(userRole)

    if (role === UsersRoles.admin && skip) return null;

    return (
        <li
            key={id}
            title={title}
            tabIndex={0}
            className={styles.liElement}
        >
            <NavLink
                to={path}
                className={({isActive}) => isActive ? styles.active : ''}
            >
                {icon}
                <span>{title}</span>
            </NavLink>
        </li>
    );
};

export default HeaderMenuListItem;