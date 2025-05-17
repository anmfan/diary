import styles from '../header-auth/header-auth.module.css';
import { logout } from "@/redux/thunks/user-thunk.ts";
import { useAppDispatch } from "@/hooks/store.ts";
import { motion } from 'motion/react';
import { NavLink } from "react-router-dom";
import { UserRole } from "@/redux/types.ts";
import { dropdownMenuItems } from "@/components/header-dropdown-menu/helper.tsx";

type TDropdownMenu = {
    role: UserRole,
}

const HeaderDropdownMenu = ({role}: TDropdownMenu) => {
    const dispatch = useAppDispatch();

    const exit = () => {
        dispatch(logout());
    }

    const items = dropdownMenuItems(role)

    return (
        <div className={styles.dropdownMenu}>
            <ul className={styles.user_list}>
                {items.map(({ title, path, icon, type }, index) => (
                    <motion.li
                        key={title}
                        tabIndex={0}
                        onClick={type === 'logout' ? exit : undefined}
                        initial={{y: -10, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        transition={{
                            duration: 0.2,
                            delay: 0.1 * index,
                        }}
                    >
                        <NavLink to={path!} className={({isActive}) => isActive ? styles.active : ''}>
                            {icon}
                            <span>{title}</span>
                        </NavLink>
                    </motion.li>
                ))}
            </ul>
        </div>
    );
};

export default HeaderDropdownMenu;