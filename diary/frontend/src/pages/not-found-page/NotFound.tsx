import { Link } from 'react-router-dom';
import styles from './notfound.module.css';

const NotFound = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>404</h1>
            <p className={styles.text}>Упс! Страница не найдена.</p>
            <Link to="/" className={styles.button}>На главную</Link>
        </div>
    );
};

export default NotFound;