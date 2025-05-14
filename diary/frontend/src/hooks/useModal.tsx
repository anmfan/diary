import {createContext, useContext} from "react";
import {TModalContext} from "@/components/admin-management-modal/types.ts";

export const ModalContext = createContext<TModalContext | null>(null);

const useModal = () => {
    const context = useContext(ModalContext)
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider')
    }
    return context;
};

export default useModal;