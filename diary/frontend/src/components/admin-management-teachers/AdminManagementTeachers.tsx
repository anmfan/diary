import styles from '@/pages/management-page/management.module.css';
import {ITeacher} from "@/redux/types.ts";
import {TabsOptions} from "../admin-management/types.ts";
import useAppSelectorsForLists from "@/hooks/useAppSelectorsForLists.ts";
import useSetSelectedItem from "@/hooks/useSetSelectedItem.ts";
import ManagementEmptyList from "../management-empty-list/ManagementEmptyList.tsx";
import {useAppSelector} from "@/hooks/store.ts";
import {sortedTeacherByGroup} from "@/redux/selectors/teachers-selector.ts";

const AdminManagementTeachers = () => {
    const {selectedItem, list} = useAppSelectorsForLists<"teachers", ITeacher[]>(TabsOptions.teachers)
    const { setSelected } = useSetSelectedItem()
    const sortedTeachers = useAppSelector(sortedTeacherByGroup);

    const teacherList = sortedTeachers === null ? list : sortedTeachers;

    if (teacherList.length === 0) {
        return <ManagementEmptyList tab={"Преподавателей"}/>
    }

    return (
        teacherList.map(teacher => (
            <div
                key={teacher.id}
                className={`${styles.listItem} ${selectedItem?.id === teacher.id ? styles.selected : ''}`}
                onClick={() => setSelected({...teacher, tab: 'teachers'})}
            >
                {teacher.first_name
                    ? teacher.first_name + ' ' + teacher.last_name
                    : teacher.username}
            </div>
        ))
    );
};

export default AdminManagementTeachers;