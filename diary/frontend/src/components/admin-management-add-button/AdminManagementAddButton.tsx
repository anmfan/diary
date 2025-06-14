import {ModalAddOptions} from "@/components/admin-management-tabs/const.tsx";
import styles from "@/pages/management-page/management.module.css";
import useModal from "@/hooks/useModal.tsx";
import {TTabsOptions} from "@/components/admin-management/types.ts";

const AdminManagementAddButton = ({activeTab}: {activeTab: TTabsOptions}) => {
    const { openModal } = useModal()

    return (
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
    );
};

export default AdminManagementAddButton;