import styles from "@/components/teacher-management/styles.module.css";
import {IGroups} from "@/redux/types.ts";
import TeacherManagementListStudentsItem
    from "@/components/teacher-management-list-students-item/TeacherManagementListStudentsItem.tsx";

type TListStudent = {
    data: IGroups | undefined | null;
}

const TeacherManagementListStudents = ({ data }: TListStudent) => {
    return (
        <ul className={styles.list}>
            {data?.students.map(({user: {first_name, last_name}, user_id, format}) => (
                <TeacherManagementListStudentsItem key={user_id} {...{first_name, last_name, user_id, format}}/>
            ))}
        </ul>
    );
};

export default TeacherManagementListStudents;