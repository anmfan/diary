import styles from "@/pages/management-page/management.module.css";
import AdminManagementEditButton from "@/components/admin-management-edit-button/AdminManagementEditButton.tsx";
import {ModalAddOptions} from "@/components/admin-management-tabs/const.tsx";
import useModal from "@/hooks/useModal.tsx";
import {TTabsOptions} from "@/components/admin-management/types.ts";
import {useAppSelector} from "@/hooks/store.ts";
import {selectSelectedItem} from "@/redux/selectors/user-selector.ts";

const AdminManagementEditNewButton = ({activeTab}: {activeTab: TTabsOptions}) => {
    const { openModal } = useModal()
    const selectedItem = useAppSelector(selectSelectedItem);

    return (
        <div className={styles.editButtons}>
            {selectedItem && <AdminManagementEditButton activeTab={activeTab} w="20" h="20"/>}
            <svg
                onClick={() => openModal(ModalAddOptions[activeTab])}
                aria-label={"Добавить"}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className={styles.biPlusLg}
                viewBox="0 0 16 16">
                <path fillRule="evenodd"
                      d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                <title>Добавить</title>
            </svg>
        </div>
    );
};

export default AdminManagementEditNewButton;