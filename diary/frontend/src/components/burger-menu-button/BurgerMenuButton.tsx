import styles from "./burgerButton.module.css";
import {Dispatch, RefObject, SetStateAction, useEffect, useRef} from "react";
import {useLocation} from "react-router-dom";

type TBurgerMenuButton = {
    setBurgerIsOpen: Dispatch<SetStateAction<boolean>>;
    burgerMenuRef: RefObject<HTMLDivElement | null>;
    burgerIsOpen: boolean;
}

const BurgerMenuButton = (
    {
        setBurgerIsOpen,
        burgerMenuRef,
        burgerIsOpen
    }: TBurgerMenuButton) => {
    const loc = useLocation();
    const btnRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutsideBurgerMenu = (e: Event) => {
            if (!burgerMenuRef.current || !btnRef.current) return;

            const clickedOutsideBurgerButton = btnRef.current?.contains(e.target as Node);
            const clickedOutsideBurgerMenu = burgerMenuRef.current?.contains(e.target as Node);

            const rect = burgerMenuRef.current.getBoundingClientRect();
            const menuIsVisible = rect.left >= 0 && rect.width > 0;

            if (menuIsVisible && !clickedOutsideBurgerMenu && !clickedOutsideBurgerButton) {
                setBurgerIsOpen(false);
            }
        }

        if (burgerIsOpen) {
            document.addEventListener("click", handleClickOutsideBurgerMenu);
        }

        return () => {
            document.removeEventListener("click", handleClickOutsideBurgerMenu);
        }
    },[burgerIsOpen, burgerMenuRef, setBurgerIsOpen])

    useEffect(() => {
        setBurgerIsOpen(false);
    }, [loc, setBurgerIsOpen]);

    return (
        <div ref={btnRef} onClick={() => setBurgerIsOpen(prev => !prev)} className={styles.burgerButton}>
            <span className={styles.burgerLine}></span>
            <span className={styles.burgerLine}></span>
            <span className={styles.burgerLine}></span>
        </div>
    )
}

export default BurgerMenuButton;