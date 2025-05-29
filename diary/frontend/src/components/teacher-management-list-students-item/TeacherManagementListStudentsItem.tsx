import styles from "@/components/teacher-management/styles.module.css";
import {useDeleteStudentMutation} from "@/redux/api/teacher-management-api.ts";

type TTeacherManagementListStudentsItem = {
    user_id: number;
    first_name: string;
    last_name: string;
}

const TeacherManagementListStudentsItem = (props: TTeacherManagementListStudentsItem) => {
    const { user_id, first_name, last_name } = props;
    const [ deleteStudent ] = useDeleteStudentMutation();

    const handleDeleteStudent = (user_id: number) => {
        deleteStudent({ user_id })
    }

    return (
        <li className={styles.listItem}>
            <span>{first_name + ' ' + last_name}</span>
            <button
                onClick={() => handleDeleteStudent(user_id)}
                className={styles.removeButton}
            >
                Удалить</button>
        </li>
    );
};

export default TeacherManagementListStudentsItem;