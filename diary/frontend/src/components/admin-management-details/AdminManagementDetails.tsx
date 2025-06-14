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
import AdminManagementDetailsSchedule
    from "@/components/admin-management-details-schedule/AdminManagementDetailsSchedule.tsx";

const AdminManagementDetails = ({activeTab}: {activeTab: TTabsOptions}) => {
    const selectedItem = useAppSelector(selectSelectedItem);

    if (!selectedItem) {
        return <div className={styles.emptyDetail}>Ничего не выбрано</div>
    }

    const tabIsSchedule = activeTab === TabsOptions.schedule && isGroup(selectedItem);

    const switchTabs = () => {
        if (activeTab === TabsOptions.teachers && isTeacher(selectedItem)) return <AdminManagementDetailsTeachers selectedItem={selectedItem}/>;
        if (activeTab === TabsOptions.students && isStudent(selectedItem)) return <AdminManagementDetailsStudents selectedItem={selectedItem}/>;
        if (activeTab === TabsOptions.groups && isGroup(selectedItem)) return <AdminManagementDetailsGroups selectedItem={selectedItem}/>;
        if (activeTab === TabsOptions.subjects && isSubject(selectedItem)) return <AdminManagementDetailsSubjects selectedItem={selectedItem}/>;
        if (tabIsSchedule) return <AdminManagementDetailsSchedule selectedItem={selectedItem}/>;
    }

    return (
        <div className={styles.detailContent}>
            {!tabIsSchedule && <h3>Подробная информация</h3>}
            {switchTabs()}
        </div>
    );
};

export default AdminManagementDetails;