import styles from "@/pages/management-page/management.module.css";
import {tabs, TTabsOptions} from "../admin-management/types.ts";
import {Dispatch, SetStateAction} from "react";
import useSetSelectedItem from "@/hooks/useSetSelectedItem.ts";
import {useAppSelector} from "@/hooks/store.ts";
import {selectSelectedItem} from "@/redux/selectors/user-selector.ts";

type TAdminTabs = {
    activeTab: TTabsOptions;
    setActiveTab: Dispatch<SetStateAction<TTabsOptions>>;
}

const AdminManagementTabs = (
    {
        activeTab,
        setActiveTab,
    }: TAdminTabs
) => {
    const { setSelected } = useSetSelectedItem()
    const selectedItem = useAppSelector(selectSelectedItem);

    const handleSwitchTab = (key: TTabsOptions) => {
        setActiveTab(key);
        if (selectedItem) {
            setSelected(null)
        }
    }

    return (
        <>
            {tabs.map(({key, label}) => (
                <button
                    key={key}
                    className={`${styles.tab} ${activeTab === key ? styles.activeTab : ''}`}
                    onClick={() => handleSwitchTab(key)}
                >
                    {label}
                </button>
            ))}
        </>
    );
};

export default AdminManagementTabs;