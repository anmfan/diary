import styles from "@/components/header/header.module.css";
import {NavLink} from "react-router-dom";
import {IHeaderListItems} from "@/components/header/const.tsx";

const HeaderMenuListItem = (
    { id, title, path, icon }: IHeaderListItems) => {
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