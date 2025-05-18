import {useAppSelector} from "@/hooks/store.ts";
import styles from "@/pages/management-page/management.module.css";
import {TabsOptions, TTabsOptions} from "../admin-management/types.ts";
import {isGroup, isStudent, isSubject, isTeacher} from './helper.ts';
import AdminManagementDetailsTeachers
    from "@/components/admin-management-details-teachers/AdminManagementDetailsTeachers.tsx";
import {selectSelectedItem} from "@/redux/selectors/user-selector.ts";
import AdminManagementDetailsStudents
    from "@/components/admin-management-details-students/AdminManagementDetailsStudents.tsx";
import AdminManagementDetailsGroups
    from "@/components/admin-management-details-groups/AdminManagementDetailsGroups.tsx";
import AdminManagementDetailsSubjects
    from "@/components/admin-management-details-subjects/AdminManagementDetailsSubjects.tsx";

const AdminManagementDetails = ({activeTab}: {activeTab: TTabsOptions}) => {
    const selectedItem = useAppSelector(selectSelectedItem);

    if (!selectedItem) {
        return <div className={styles.emptyDetail}>Ничего не выбрано</div>
    }

    return (
        <div className={styles.detailContent}>
            <h3>Подробная информация</h3>
            {activeTab === TabsOptions.teachers && isTeacher(selectedItem) && (
                <AdminManagementDetailsTeachers selectedItem={selectedItem}/>
            )}
            {activeTab === TabsOptions.students && isStudent(selectedItem) && (
                <AdminManagementDetailsStudents selectedItem={selectedItem}/>
            )}
            {activeTab === TabsOptions.groups && isGroup(selectedItem) && (
                <AdminManagementDetailsGroups selectedItem={selectedItem}/>
            )}
            {activeTab === TabsOptions.subjects && isSubject(selectedItem) && (
                <AdminManagementDetailsSubjects selectedItem={selectedItem}/>
            )}
        </div>
    );
};

export default AdminManagementDetails;