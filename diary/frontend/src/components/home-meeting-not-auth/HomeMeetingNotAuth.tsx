import styles from './home-meeting-not-auth.module.css';

const HomeMeetingNotAuth = () => {
    return (
        <h2 className={styles.prompt}>Для работы с дневником требуется авторизация.</h2>
    );
};

export default HomeMeetingNotAuth;