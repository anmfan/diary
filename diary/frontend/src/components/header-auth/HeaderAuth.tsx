import {useAppSelector} from "@/hooks/store.ts";
import {headerAvatar} from "@/redux/selectors/user-selector.ts";
import styles from './header-auth.module.css';
import HeaderAvatar from "../header-avatar/HeaderAvatar.tsx";
import {useEffect, useRef, useState} from "react";
import HeaderDropdownMenu from "../header-dropdown-menu/HeaderDropdownMenu.tsx";
import Spinner from "../spinner/Spinner.tsx";

const HeaderAuth = () => {
    const {username, avatar, role} = useAppSelector(headerAvatar)
    const [dropdownIsOpen, setDropdownIsOpen] = useState<boolean>(false);
    const menuListRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutsideDropdownMenu = (e: Event) => {
            if (menuListRef.current && !menuListRef.current.contains(e.target as Node)) {
                setDropdownIsOpen(false);
            }
        }

        if (dropdownIsOpen) {
            document.addEventListener("click", handleClickOutsideDropdownMenu)
        }

        return () => {
            document.removeEventListener("click", handleClickOutsideDropdownMenu)
        }

    },[dropdownIsOpen])

    const handleDropdown = () => {
        setDropdownIsOpen(prev => !prev)
    }

    if (!username) {
        return <Spinner />;
    }

    return (
        <>
            <div onClick={handleDropdown} ref={menuListRef} className={styles.user}>
                <HeaderAvatar width={24} height={24} avatar={avatar}/>
                <span style={{userSelect: 'none'}}>{username}</span>
            </div>
            {dropdownIsOpen && <HeaderDropdownMenu role={role}/>}
        </>
    );
};

export default HeaderAuth;