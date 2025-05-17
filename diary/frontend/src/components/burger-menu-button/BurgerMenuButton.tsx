import styles from "./burgerButton.module.css";
import {Dispatch, RefObject, SetStateAction, useEffect, useRef} from "react";
import {useLocation} from "react-router-dom";

type TBurgerMenuButton = {
    setBurgerIsOpen: Dispatch<SetStateAction<boolean>>;
    burgerMenuRef: RefObject<HTMLDivElement | null>;
    burgerIsOpen: boolean;
    dropdownRef?: RefObject<HTMLDivElement | null>;
}

const BurgerMenuButton = (
    {
        setBurgerIsOpen,
        burgerMenuRef,
        burgerIsOpen,
    }: TBurgerMenuButton) => {
    const loc = useLocation();
    const btnRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutsideBurgerMenu = (e: Event) => {
            if (!burgerMenuRef.current || !btnRef.current) return;

            const clickedOutsideButton = !btnRef.current?.contains(e.target as Node);
            const clickedOutsideMenu = !burgerMenuRef.current?.contains(e.target as Node);

            if (clickedOutsideMenu && clickedOutsideButton) {
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