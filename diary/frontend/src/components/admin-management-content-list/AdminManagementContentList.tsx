import {TabsOptions, TTabsOptions} from "../admin-management/types.ts";
import AdminManagementTeachers from "../admin-management-teachers/AdminManagementTeachers.tsx";
import AdminManagementStudents from "../admin-management-students/AdminManagementStudents.tsx";
import AdminManagementSubjects from "../admin-management-subjects/AdminManagementSubjects.tsx";
import AdminManagementGroups from "../admin-management-groups/AdminManagementGroups.tsx";

const AdminManagementContentList = ({activeTab}: { activeTab: TTabsOptions }) => {
    const defineConfig = () => {
        switch (activeTab) {
            case TabsOptions.teachers: return <AdminManagementTeachers/>;
            case TabsOptions.students: return <AdminManagementStudents/>;
            case TabsOptions.groups: return <AdminManagementGroups/>;
            case TabsOptions.subjects: return <AdminManagementSubjects/>;
            default: return null;
        }
    }
    return defineConfig()
};

export default AdminManagementContentList;