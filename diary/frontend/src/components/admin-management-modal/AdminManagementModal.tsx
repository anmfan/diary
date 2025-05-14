import Modal from "react-modal";
import './modal.css'
import useModal from "@/hooks/useModal.tsx";

const AdminManagementModal = () => {
    const { modalIsOpen, closeModal, modalContent, modalLabel } = useModal();

    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel={modalLabel}
            closeTimeoutMS={200}
            className="Modal"
            overlayClassName="Overlay"
        >
            <div>{modalContent}</div>
            <button
                onClick={closeModal}
                className="close-button"
                aria-label="Закрыть"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                </svg>
            </button>
        </Modal>
    );
};

export default AdminManagementModal;