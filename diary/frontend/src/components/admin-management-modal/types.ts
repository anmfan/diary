import {ReactNode} from "react";

export type TModalContext = {
    modalIsOpen: boolean;
    openModal: (content: ReactNode) => void;
    closeModal: () => void;
    modalContent: ReactNode;
    modalLabel: string;
}