import {HEADER_LIST_ITEMS} from "../header/const.ts";
import {NavLink} from "react-router-dom";
import styles from "../header/header.module.css";

const HeaderMenuList = () => {
    return (
        <ul className={styles.list}>
            {HEADER_LIST_ITEMS.map((item) => (
                <li key={item.id}>
                    <NavLink
                        to={item.path}
                        className={({isActive}) => isActive ? styles.active : ''}
                    >
                        {item.title}
                    </NavLink>
                </li>
            ))}
        </ul>
    );
};

export default HeaderMenuList;