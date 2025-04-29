import styles from "@/pages/management-page/management.module.css";
import {TabsOptions, TTabsOptions} from "../admin-management/types.ts";
import {Dispatch, SetStateAction} from "react";
import useSetSelectedItem from "@/hooks/useSetSelectedItem.ts";
import {useAppSelector} from "@/hooks/store.ts";
import {selectSelectedItem} from "@/redux/selectors/user-selector.ts";
import AdminManagementEditButton from "../admin-management-edit-button/AdminManagementEditButton.tsx";

const tabs = [
    { key: TabsOptions.teachers, label: 'Преподаватели' },
    { key: TabsOptions.students, label: 'Студенты' },
    { key: TabsOptions.groups, label: 'Группы' },
    { key: TabsOptions.subjects, label: 'Предметы' },
];

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
            <div className={styles.editButtons}>
                {selectedItem && <AdminManagementEditButton w={"20"} h={"20"}/>}
                <svg aria-label={"Добавить"} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className={styles.biPlusLg}
                     viewBox="0 0 16 16">
                    <path fillRule="evenodd"
                          d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                    <title>Добавить</title>
                </svg>
            </div>
        </>
    );
};

export default AdminManagementTabs;