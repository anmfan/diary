import styles from "@/pages/management-page/management.module.css";

const TeacherManagement = () => {
    return (
        <div className={styles.block}>
            <h2 className={styles.subtitle}>Студенты моей группы</h2>
            <button className={styles.addButton}>Добавить студента</button>
            <ul className={styles.list}>
                <li className={styles.listItem}>
                    <span>Петрова А.А.</span>
                    <button className={styles.removeButton}>Удалить</button>
                </li>
                <li className={styles.listItem}>
                    <span>Смирнов Д.Д.</span>
                    <button className={styles.removeButton}>Удалить</button>
                </li>
            </ul>
        </div>
    );
};

export default TeacherManagement;