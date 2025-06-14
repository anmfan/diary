import {useEffect, useState} from 'react';
import styles from '@/pages/management-page/management.module.css';
import {useAppDispatch} from "@/hooks/store.ts";
import {getAllTeachers} from "@/redux/thunks/teachers-thunk.ts";
import {getAllStudents} from "@/redux/thunks/students-thunk.ts";
import AdminManagementTabs from "../admin-management-tabs/AdminManagementTabs.tsx";
import AdminManagementContentList from "../admin-management-content-list/AdminManagementContentList.tsx";
import {TabsOptions, TTabsOptions} from "./types.ts";
import AdminManagementTitles from "../admin-management-titles/AdminManagementTitles.tsx";
import AdminManagementDetails from "../admin-management-details/AdminManagementDetails.tsx";
import {getAllGroups} from "@/redux/thunks/groups-thunk.ts";
import {getAllSubjects} from "@/redux/thunks/subjects-thunk.ts";
import useModal from "@/hooks/useModal.tsx";
import AdminManagementModal from "@/components/admin-management-modal/AdminManagementModal.tsx";
import AdminManagementEditNewButton
    from "@/components/admin-management-edit-new-button/AdminManagementEditNewButton.tsx";

const AdminManagement = () => {
    const [activeTab, setActiveTab] = useState<TTabsOptions>(TabsOptions.teachers);
    const dispatch = useAppDispatch()
    const { modalIsOpen } = useModal()

    useEffect(() => {
        Promise.all([
            dispatch(getAllTeachers()),
            dispatch(getAllStudents()),
            dispatch(getAllGroups()),
            dispatch(getAllSubjects())
        ])
    },[dispatch])

    const activeTabIsSchedule = activeTab === TabsOptions.schedule;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Панель управления администратора</h1>
            <div className={styles.tabs}>
                <AdminManagementTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                <AdminManagementEditNewButton activeTab={activeTab}/>
            </div>
            <div className={styles.content}>
                <div className={`${activeTabIsSchedule ? styles.listContainerSchedule : styles.listContainer}`}>
                    <AdminManagementTitles
                        activeTab={activeTab}
                    />
                    <AdminManagementContentList
                        activeTab={activeTab}
                    />
                </div>

                <div className={`${activeTabIsSchedule ? styles.detailScheduleContainer : styles.detailContainer}`}>
                    <AdminManagementDetails
                        activeTab={activeTab}
                    />
                </div>
            </div>
            {modalIsOpen && <AdminManagementModal/>}
        </div>
    );
};

export default AdminManagement;