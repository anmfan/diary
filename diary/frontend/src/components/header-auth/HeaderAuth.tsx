import { useAppSelector } from "@/hooks/store.ts";
import { headerAvatar } from "@/redux/selectors/user-selector.ts";
import styles from './header-auth.module.css';
import HeaderAvatar from "../header-avatar/HeaderAvatar.tsx";
import {useRef, useState} from "react";
import HeaderDropdownMenu from "../header-dropdown-menu/HeaderDropdownMenu.tsx";
import Spinner from "../spinner/Spinner.tsx";
import { MouseEvent } from "react";
import {SERVER_BASE_URL} from "@/const.ts";

const HeaderAuth = () => {
    const { username, avatar, role } = useAppSelector(headerAvatar)
    const [dropdownIsOpen, setDropdownIsOpen] = useState<boolean>(false);
    const menuListRef = useRef<HTMLDivElement | null>(null);

    const handleDropdown = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        setDropdownIsOpen(prev => !prev)
    }

    if (!username) {
        return <Spinner />;
    }

    const userAvatar = avatar ? SERVER_BASE_URL + avatar : null;

    return (
        <>
            <div
                onClick={handleDropdown}
                tabIndex={0}
                ref={menuListRef}
                className={styles.user}
            >
                <>
                    <HeaderAvatar width={28} height={28} avatar={userAvatar}/>
                    <span style={{userSelect: 'none'}}>{username}</span>
                </>
                {dropdownIsOpen && <HeaderDropdownMenu role={role} />}
            </div>
        </>
    );
};

export default HeaderAuth;