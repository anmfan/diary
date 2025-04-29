import {useAppSelector} from "@/hooks/store.ts";
import styles from "@/pages/management-page/management.module.css";
import {TabsOptions, TSelectedItem, TTabsOptions} from "../admin-management/types.ts";
import {IGroups, IStudent, ISubject, ITeacher} from "@/redux/types.ts";

const AdminManagementDetails = ({activeTab}: {activeTab: TTabsOptions}) => {
    const selectedItem = useAppSelector(state => state.user.selectedItem);

    if (!selectedItem) {
        return <div className={styles.emptyDetail}>Ничего не выбрано</div>
    }

    const isTeacher = (item: TSelectedItem): item is ITeacher => {
        return "username" in item!;
    }
    const isStudent = (item: TSelectedItem): item is IStudent => {
        return "username" in item!;
    }
    const isGroup = (item: TSelectedItem): item is IGroups => {
        return "students_count" in item!;
    }
    const isSubject = (item: TSelectedItem): item is ISubject => {
        return "name" in item!;
    }

    return (
        <div className={styles.detailContent}>
            <h3>Подробная информация</h3>
            {activeTab === TabsOptions.teachers && isTeacher(selectedItem) && (
                <>
                    <p><strong>ФИО:</strong> {selectedItem.first_name ? selectedItem.first_name + ' ' + selectedItem.last_name : "Не задано"}</p>
                    <p><strong>Логин:</strong> {selectedItem.username}</p>
                </>
            )}
            {activeTab === TabsOptions.students && isStudent(selectedItem) && (
                <>
                    <p><strong>ФИО:</strong> {selectedItem.first_name ? selectedItem.first_name + ' ' + selectedItem.last_name : "Не задано"}</p>
                    <p><strong>Логин:</strong> {selectedItem.username}</p>
                    <p><strong>Группа:</strong> 123 группа</p>
                </>
            )}
            {activeTab === TabsOptions.groups && isGroup(selectedItem) && (
                <>
                    <p><strong>Название:</strong> {selectedItem.name}</p>
                    <p><strong>Количество студентов:</strong> {selectedItem.students_count}</p>
                </>
            )}
            {activeTab === TabsOptions.subjects && isSubject(selectedItem) && (
                <>
                    <p><strong>Название:</strong> {selectedItem.name}</p>
                </>
            )}
        </div>
    );
};

export default AdminManagementDetails;