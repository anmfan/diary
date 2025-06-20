import styles from "@/pages/management-page/management.module.css";
import AdminManagementEditButton from "@/components/admin-management-edit-button/AdminManagementEditButton.tsx";
import {TabsOptions, TTabsOptions} from "@/components/admin-management/types.ts";
import {useAppSelector} from "@/hooks/store.ts";
import {selectSelectedItem} from "@/redux/selectors/user-selector.ts";
import {exportToExcel} from "@/components/admin-management/helper.ts";
import {sortedTeacherByGroup} from "@/redux/selectors/teachers-selector.ts";
import {sortedStudentsByGroup} from "@/redux/selectors/students-selector.ts";
import {sortedGroupsByCurator} from "@/redux/selectors/groups-selector.ts";
import {allSubjects} from "@/redux/selectors/subjects-selector.ts";
import {useMemo} from "react";
import AdminManagementAddButton from "@/components/admin-management-add-button/AdminManagementAddButton.tsx";

const AdminManagementEditNewButton = ({activeTab}: {activeTab: TTabsOptions}) => {
    const selectedItem = useAppSelector(selectSelectedItem);
    const teachers = useAppSelector(sortedTeacherByGroup);
    const students = useAppSelector(sortedStudentsByGroup);
    const groups = useAppSelector(sortedGroupsByCurator);
    const subjects = useAppSelector(allSubjects);

    const arrayItemsForExport = useMemo(() => {
        switch (activeTab) {
            case TabsOptions.teachers: return  { arrayItems: teachers, label: "Преподаватели" };
            case TabsOptions.students: return { arrayItems: students, label: "Студенты" };
            case TabsOptions.groups: return { arrayItems: groups, label: "Группы" };
            case TabsOptions.subjects: return { arrayItems: subjects, label: "Предметы" };
            case TabsOptions.schedule: return { arrayItems: null, label: "расписание"};
        }
    },[activeTab, groups, students, subjects, teachers])

    return (
        <div className={styles.editButtons}>
            {selectedItem && <AdminManagementEditButton activeTab={activeTab} w="20" h="20"/> }
            {activeTab !== TabsOptions.schedule && <AdminManagementAddButton activeTab={activeTab}/> }
            {activeTab === TabsOptions.schedule && selectedItem && <AdminManagementAddButton activeTab={activeTab}/> }
            {activeTab !== TabsOptions.schedule && (
                <svg onClick={() => exportToExcel(arrayItemsForExport)} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                     className="bi bi-filetype-xlsx" viewBox="0 0 16 16">
                    <path fillRule="evenodd"
                          d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z"/>
                    <title>Экспортировать список</title>
                </svg>
            )}
        </div>
    );
};

export default AdminManagementEditNewButton;