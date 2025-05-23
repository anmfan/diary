import styles from "@/pages/management-page/management.module.css";
import useAppSelectorsForLists from "@/hooks/useAppSelectorsForLists.ts";
import {IStudent} from "@/redux/types.ts";
import {TabsOptions} from "../admin-management/types.ts";
import useSetSelectedItem from "@/hooks/useSetSelectedItem.ts";
import ManagementEmptyList from "../management-empty-list/ManagementEmptyList.tsx";
import {useAppSelector} from "@/hooks/store.ts";
import {sortedStudentsByGroup} from "@/redux/selectors/students-selector.ts";

const AdminManagementStudents = () => {
    const { selectedItem, list } = useAppSelectorsForLists<"students", IStudent[]>(TabsOptions.students);
    const { setSelected } = useSetSelectedItem();
    const sortedStudents = useAppSelector(sortedStudentsByGroup);

    const studentsList = sortedStudents === null ? list : sortedStudents;

    if (studentsList.length === 0) {
        return <ManagementEmptyList tab={"Студентов"}/>
    }

    return (
        studentsList.map(student => (
            <div
                key={student.id}
                className={`${styles.listItem} ${selectedItem?.id === student.id ? styles.selected : ''}`}
                onClick={() => setSelected({...student, tab: 'students'})}
            >
                {student.first_name
                    ? student.first_name + ' ' + student.last_name
                    : student.username}
            </div>
        ))
    );
};

export default AdminManagementStudents;