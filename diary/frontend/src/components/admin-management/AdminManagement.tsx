import {useEffect, useState} from 'react';
import styles from '@/pages/management-page/management.module.css';
import {useAppDispatch} from "@/hooks/store.ts";
import {getAllTeachers} from "@/redux/thunks/teachers-thunk.ts";
import {getAllStudents} from "@/redux/thunks/students-thunk.ts";
import AdminManagementTabs from "../admin-management-tabs/AdminManagementTabs.tsx";
import AdminManagementContentList from "../admin-management-content-list/AdminManagementContentList.tsx";
import {TTabsOptions} from "./types.ts";
import AdminManagementTitles from "../admin-management-titles/AdminManagementTitles.tsx";
import AdminManagementDetails from "../admin-management-details/AdminManagementDetails.tsx";
import {getAllGroups} from "@/redux/thunks/groups-thunk.ts";

const TabsOptions = {
    teachers: 'teachers',
    students: 'students',
    groups: 'groups',
    subjects: 'subjects',
} as const;


const AdminManagement = () => {
    const [activeTab, setActiveTab] = useState<TTabsOptions>(TabsOptions.teachers);
    const dispatch = useAppDispatch()

    useEffect(() => {
        Promise.all([
            dispatch(getAllTeachers()),
            dispatch(getAllStudents()),
            dispatch(getAllGroups()),
            //dispatch(getAllSubjects())
        ])
    },[dispatch])

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Панель управления администратора</h1>
            <div className={styles.tabs}>
                <AdminManagementTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </div>
            <div className={styles.content}>
                <div className={styles.listContainer}>
                    <AdminManagementTitles
                        activeTab={activeTab}
                    />
                    <AdminManagementContentList
                        activeTab={activeTab}
                    />
                </div>

                <div className={styles.detailContainer}>
                    <AdminManagementDetails
                        activeTab={activeTab}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminManagement;