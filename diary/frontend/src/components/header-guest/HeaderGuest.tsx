import styles from "../home-meeting-not-auth/home-meeting-not-auth.module.css";
import {ROUTES_ENDPOINTS} from "../routes/const.tsx";
import {Link} from "react-router-dom";

const HeaderGuest = () => {
    return (
        <Link className={styles.loginButton} to={ROUTES_ENDPOINTS.AUTH}>Войти</Link>
    );
};

export default HeaderGuest;