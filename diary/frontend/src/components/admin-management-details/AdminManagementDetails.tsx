import {useAppSelector} from "@/hooks/store.ts";
import styles from "@/pages/management-page/management.module.css";
import {TabsOptions, TTabsOptions} from "../admin-management/types.ts";
import {fioIsExist, isGroup, isStudent, isSubject, isTeacher} from './helper.ts';

const AdminManagementDetails = ({activeTab}: {activeTab: TTabsOptions}) => {
    const selectedItem = useAppSelector(state => state.user.selectedItem);

    if (!selectedItem) {
        return <div className={styles.emptyDetail}>Ничего не выбрано</div>
    }

    return (
        <div className={styles.detailContent}>
            <h3>Подробная информация</h3>
            {activeTab === TabsOptions.teachers && isTeacher(selectedItem) && (
                <>
                    <p><strong>ФИО:</strong> {fioIsExist(
                        selectedItem.first_name!,
                        selectedItem.last_name!,
                        selectedItem.email,
                        "teacher"
                    )}</p>
                    <p><strong>Логин:</strong> {selectedItem.username}</p>
                </>
            )}
            {activeTab === TabsOptions.students && isStudent(selectedItem) && (
                <>
                    <p><strong>ФИО:</strong> {fioIsExist(
                        selectedItem.first_name!,
                        selectedItem.last_name!,
                        selectedItem.email,
                        "student"
                    )}</p>
                    <p><strong>Логин:</strong> {selectedItem.username}</p>
                    <p><strong>Группа:</strong> {selectedItem.group ? selectedItem.group : 'Нет группы'}</p>
                </>
            )}
            {activeTab === TabsOptions.groups && isGroup(selectedItem) && (
                <>
                    <p><strong>Название:</strong> {selectedItem.name}</p>
                    <p><strong>Куратор:</strong> {fioIsExist("", "", "","group", selectedItem)}</p>
                    <p><strong>Курс:</strong> {selectedItem.course}</p>
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