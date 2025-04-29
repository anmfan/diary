import styles from './main-container.module.css';
import {ReactNode} from "react";

const MainContainer = ({children}: {children: ReactNode}) => {
    return <main className={styles.main}>{children}</main>
};

export default MainContainer;