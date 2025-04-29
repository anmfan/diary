import styles from '@/pages/management-page/management.module.css';
import {ITeacher} from "@/redux/types.ts";
import {TabsOptions} from "../admin-management/types.ts";
import useAppSelectorsForLists from "@/hooks/useAppSelectorsForLists.ts";
import useSetSelectedItem from "@/hooks/useSetSelectedItem.ts";
import ManagementEmptyList from "../management-empty-list/ManagementEmptyList.tsx";

const AdminManagementTeachers = () => {
    const {selectedItem, list} = useAppSelectorsForLists<"teachers", ITeacher[]>(TabsOptions.teachers)
    const { setSelected } = useSetSelectedItem()

    if (list.length === 0) {
        return <ManagementEmptyList tab={"Преподавателей"}/>
    }

    return (
        list.map(teacher => (
            <div
                key={teacher.id}
                className={`${styles.listItem} ${selectedItem?.id === teacher.id ? styles.selected : ''}`}
                onClick={() => setSelected(teacher)}
            >
                {teacher.first_name
                    ? teacher.first_name + ' ' + teacher.last_name
                    : teacher.username}
            </div>
        ))
    );
};

export default AdminManagementTeachers;