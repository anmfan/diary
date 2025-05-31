import styles from "@/components/teacher-management/styles.module.css";
import {useGetSubjectsQuery} from "@/redux/api/teacher-management-api.ts";

const GroupSubjectsList = ({ groupId }: { groupId: number }) => {
    const { data } = useGetSubjectsQuery({ groupId })

    return (
        <div className={styles.subjectsContainer}>
            <h3 className={styles.subjectsTitle}>Предметы группы</h3>

            {data?.length === 0 && (
                <div className={styles.emptySubjects}>
                    Нет прикрепленных предметов
                </div>
            )}
            <ul className={styles.subjectsList}>
                {data?.map(({subject, teacher: { user: { first_name, last_name } }}) => (
                    <li key={subject.id} className={styles.subjectItem}>
                        <div className={styles.subjectInfo}>
                            <span className={styles.subjectName}>{subject.name}</span>
                            <span className={styles.subjectTeacherName}>{first_name && first_name + " " + last_name}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GroupSubjectsList;