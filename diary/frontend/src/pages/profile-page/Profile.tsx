import MainContainer from "@/components/main-container/MainContainer.tsx";
import styles from './profile.module.css';
import {headerAvatar} from "@/redux/selectors/user-selector.ts";
import {useAppSelector} from "@/hooks/store.ts";
import HeaderAvatar from "@/components/header-avatar/HeaderAvatar.tsx";

const Profile = () => {
    const { avatar, username } = useAppSelector(headerAvatar);

    // Пример данных для электронного дневника
    const stats = [
        { title: 'Текущий класс', value: '11-Б' },
        { title: 'Средний балл', value: '4.8' },
        { title: 'Посещаемость', value: '98%' }
    ];

    return (
        <MainContainer>
            <div className={styles.container}>
                <div className={styles.top}>
                    <div className={styles.profileHeader}>
                        <HeaderAvatar width={150} height={150} avatar={avatar} />
                        <div className={styles.profileInfo}>
                            <div className={styles.userInfo}>
                                <h1>{username}</h1>
                                <p>Ученик средней школы №12</p>
                            </div>
                            <div className={styles.actions}>
                                <button className={styles.editButton}>Редактировать профиль</button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.statsContainer}>
                        {stats.map((stat) => (
                            <div key={stat.title} className={styles.statItem}>
                                <h3>{stat.value}</h3>
                                <p>{stat.title}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.gradesSection}>
                    <h2>Последние оценки</h2>
                    <div className={styles.gradesGrid}>
                        <div className={styles.gradeSubject}>Математика</div>
                        <div className={styles.gradeMark}>5</div>
                        <div className={styles.gradeDate}>12.09.2023</div>

                        <div className={styles.gradeSubject}>Физика</div>
                        <div className={styles.gradeMark}>4</div>
                        <div className={styles.gradeDate}>11.09.2023</div>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
};

export default Profile;