import { ModalContext } from "@/hooks/useModal";
import {ReactNode, useState} from "react";

const ModalProvider = ({children}: { children: ReactNode }) => {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<ReactNode>(null);
    const [modalLabel, setModalLabel] = useState('');

    const openModal = (content?: ReactNode, label?: string) => {
        if (content) setModalContent(content)
        if (label) setModalLabel(label)
        setModalIsOpen(true)
    }
    const closeModal = () => {
        setModalIsOpen(false);
        setModalContent(null);
        setModalLabel('')
    }

    return (
        <ModalContext.Provider value={{ modalIsOpen, openModal, closeModal, modalContent, modalLabel }}>
            {children}
        </ModalContext.Provider>
    )
};

export default ModalProvider;