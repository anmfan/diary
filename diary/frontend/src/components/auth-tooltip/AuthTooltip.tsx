import styles from './auth-tooltip.module.css';

const AuthTooltip = () => {
    return (
        <div className={styles.tooltip}>
            <span className={styles.icon}>!</span>
            <div className={styles.text}>При отсутствии пароля, обратитесь к вышестоящему руководителю на платформе.</div>
        </div>
    );
};

export default AuthTooltip;