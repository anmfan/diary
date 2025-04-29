import styles from './header.module.css';
import {Link} from "react-router-dom";
import {ROUTES_ENDPOINTS} from "../routes/const.tsx";
import HeaderMenuList from "../header-menu-list/HeaderMenuList.tsx";
import { motion } from 'motion/react';
import useAuth from "@/hooks/useAuth.tsx";
import HeaderAuth from "../header-auth/HeaderAuth.tsx";
import HeaderGuest from '../header-guest/HeaderGuest.tsx';
import {useRef, useState} from "react";
import BurgerMenuButton from "../burger-menu-button/BurgerMenuButton.tsx";


const Header = () => {
    const isAuth = useAuth();
    const [burgerIsOpen, setBurgerIsOpen] = useState<boolean>(false);
    const burgerMenuRef = useRef<HTMLDivElement | null>(null)

    return (
        <motion.header
            className={styles.header}
            initial={{y: -105, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{type: "tween", stiffness: 100}}
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
                    <HeaderMenuList/>
                    <div className={styles.account}>
                        {isAuth && <HeaderAuth/>}
                        {!isAuth && <HeaderGuest/>}
                    </div>
                </div>
                <BurgerMenuButton
                    setBurgerIsOpen={setBurgerIsOpen}
                    burgerMenuRef={burgerMenuRef}
                    burgerIsOpen={burgerIsOpen}
                />
            </div>
        </motion.header>
    );
};

export default Header;