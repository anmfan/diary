import styles from "./styles.module.css";
import {useDeleteStudentMutation, useGetGroupDataQuery} from "@/redux/api/teacher-management-api.ts";
import {useAppSelector} from "@/hooks/store.ts";
import {RootState} from "@/redux/types.ts";
import Spinner from "@/components/spinner/Spinner.tsx";

const TeacherManagement = () => {
    const email = useAppSelector((state: Pick<RootState, 'user'>) => state.user.user.email)!
    const { data, isLoading } = useGetGroupDataQuery({email})
    const [ deleteStudent ] = useDeleteStudentMutation();

    const handleDeleteStudent = (user_id: number) => {
        deleteStudent({ user_id })
    }

    if (isLoading) return <Spinner />

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Управление группой {data?.name}</h1>

            <div className={styles.content}>
                <div className={styles.listContainer}>
                    <div className={styles.listTitle}>
                        <h2>Студенты группы</h2>
                        <button className={styles.managementButton}>Добавить студента</button>
                    </div>

                    <ul className={styles.list}>
                        {data?.students.map(({user: {first_name, last_name}, user_id}) => (
                            <li key={user_id} className={styles.listItem}>
                                <span>{first_name + ' ' + last_name}</span>
                                <button
                                    onClick={() => handleDeleteStudent(user_id)}
                                    className={styles.removeButton}
                                >
                                    Удалить</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TeacherManagement;