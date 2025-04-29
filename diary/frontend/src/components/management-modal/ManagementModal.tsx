import Modal from 'react-modal';
import {ReactNode} from "react";
import styles from './management-modal.module.css';

type TModal = {
    children: ReactNode;
    isOpen: boolean;
    onRequestClose: () => void;
}

const ManagementModal = ({children, isOpen, onRequestClose}: TModal) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => {}}
            className={styles.modal}
            overlayClassName={styles.overlay}
        >
            <button onClick={onRequestClose}>Закрыть</button>
            {children}
        </Modal>
    );
};

export default ManagementModal;