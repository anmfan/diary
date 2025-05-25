import styles from "@/pages/management-page/management.module.css";
import {tabs, TabsOptions, TTabsOptions} from "../admin-management/types.ts";
import SortingOptionsStudents from "@/components/sorting-options-students/SortingOptionsStudents.tsx";
import { Fragment } from "react";
import SortingOptionsGroups from "@/components/sorting-options-groups/SortingOptionsGroups.tsx";
import SortingOptionsTeachers from "@/components/sorting-options-teachers/SortingOptionsTeachers.tsx";

const AdminManagementTitles = ({activeTab}: {activeTab: TTabsOptions}) => {
    const chooseSortingOptionsVariant = (key: TTabsOptions) => {
        if (key === TabsOptions.students && key === activeTab) return <SortingOptionsStudents/>
        if (key === TabsOptions.groups && key === activeTab) return <SortingOptionsGroups/>
        if (key === TabsOptions.teachers && key === activeTab) return <SortingOptionsTeachers/>
    }

    return (
        <h2 className={styles.listTitle}>
            {tabs.map(({key, label}) => (
                <Fragment key={key}>
                    {key === activeTab && label}
                    {chooseSortingOptionsVariant(key)}
                </Fragment>
            ))}
        </h2>
    );
};

export default AdminManagementTitles;