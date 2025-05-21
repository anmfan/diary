import styles from "@/pages/management-page/management.module.css";
import {tabs, TabsOptions, TTabsOptions} from "../admin-management/types.ts";
import SortingOptionsStudents from "@/components/sorting-options-students/SortingOptionsStudents.tsx";
import { Fragment } from "react";

const AdminManagementTitles = ({activeTab}: {activeTab: TTabsOptions}) => {
    return (
        <h2 className={styles.listTitle}>
            {tabs.map(({key, label}) => (
                <Fragment key={key}>
                    {key === activeTab && label}
                    {key === TabsOptions.students && key === activeTab && <SortingOptionsStudents/>}
                </Fragment>
            ))}
        </h2>
    );
};

export default AdminManagementTitles;