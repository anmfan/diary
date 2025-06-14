import styles from "@/components/teacher-management/styles.module.css";
import {useGetSubjectsQuery} from "@/redux/api/teacher-management-api.ts";

type TGroupSubjectsList = {
    groupIds: number[];
    currentGroupId: number;
}

const GroupSubjectsList = ({ groupIds, currentGroupId }: TGroupSubjectsList) => {
    const { data } = useGetSubjectsQuery({ groupIds })

    const subjectsByGroup = data?.filter(subject => subject.groupId === currentGroupId);

    return (
        <div className={styles.subjectsContainer}>
            <h3 className={styles.subjectsTitle}>Предметы группы</h3>

            {subjectsByGroup?.length === 0 && (
                <div className={styles.emptySubjects}>
                    Нет прикрепленных предметов
                </div>
            )}
            <ul className={styles.subjectsList}>
                {subjectsByGroup?.map(({ subject, teacher }) => {
                    const first_name = teacher?.user.first_name ?? '';
                    const last_name = teacher?.user.last_name ?? '';

                    return (
                        <li key={subject?.id} className={styles.subjectItem}>
                            <div className={styles.subjectInfo}>
                                <span className={styles.subjectName}>{subject?.name}</span>
                                <span className={styles.subjectTeacherName}>{first_name && `${first_name} ${last_name}`}</span>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
};

export default GroupSubjectsList;