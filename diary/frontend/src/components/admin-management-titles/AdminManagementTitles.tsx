import styles from "@/pages/management-page/management.module.css";
import {tabs, TTabsOptions} from "../admin-management/types.ts";

const AdminManagementTitles = ({activeTab}: {activeTab: TTabsOptions}) => {
    return (
        <h2 className={styles.listTitle}>
            {tabs.map((tab) => (
                tab.key === activeTab && tab.label
            ))}
        </h2>
    );
};

export default AdminManagementTitles;