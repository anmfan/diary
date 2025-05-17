import styles from './header.module.css';
import {Link} from "react-router-dom";
import {ROUTES_ENDPOINTS} from "../routes/const.tsx";
import { motion } from 'motion/react';
import {useRef, useState} from "react";
import BurgerMenuButton from "../burger-menu-button/BurgerMenuButton.tsx";
import { transitionParams } from "@/components/header/const.tsx";
import HeaderMenuList from "@/components/header-menu-list/HeaderMenuList.tsx";

const Header = () => {
    const [burgerIsOpen, setBurgerIsOpen] = useState<boolean>(false);
    const [asideIsClosed, setAsideIsClosed] = useState<boolean>(false)
    const burgerMenuRef = useRef<HTMLDivElement | null>(null)

    const toggleSidebar = () => {
        setAsideIsClosed(prev => !prev);
    }

    return (
        <motion.aside
            className={`${styles.header} ${asideIsClosed && styles.asideIsClosed}`}
            initial={{x: -500, opacity: 0}}
            animate={{
                x: 0,
                opacity: 1,
                width: asideIsClosed ? 60 : 240,
           }}
            transition={transitionParams}
        >
            <div className={styles.container}>
                <Link to={ROUTES_ENDPOINTS.HOME}>
                    <img
                        width={80}
                        height={80}
                        src="/logoWEBP.webp"
                        alt="Логотип"
                        title="Логотип"
                        aria-label="Перейти на главную"
                    />
                </Link>
                <div ref={burgerMenuRef} className={`${styles.menu} ${burgerIsOpen ? styles.active : ""}`}>
                    <HeaderMenuList />
                </div>
                <BurgerMenuButton
                    setBurgerIsOpen={setBurgerIsOpen}
                    burgerMenuRef={burgerMenuRef}
                    burgerIsOpen={burgerIsOpen}
                />
                <button onClick={toggleSidebar} className={styles.toggleAside}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                         stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6"/>
                    </svg>
                </button>
            </div>
        </motion.aside>
    );
};

export default Header;