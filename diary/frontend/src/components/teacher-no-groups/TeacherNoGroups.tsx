import styles from './styles.module.css'

const TeacherNoGroups = () => {
    return (
        <div className={styles.noGroupWrapper}>
            <div className={styles.noGroupMessage}>
                <h2>Нет прикреплённых дисциплин</h2>
                <p>Вы ещё не связаны ни с одной дисциплиной. Обратитесь к администратору</p>
            </div>
        </div>
    );
};

export default TeacherNoGroups;