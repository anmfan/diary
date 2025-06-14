import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from '../src/components/app/App.tsx';
import {store} from "./redux/store/store.ts";
import {ToastContainer} from "react-toastify";
import Modal from "react-modal";
import ModalProvider from "@/components/modal-provider/modal-provider.tsx";

Modal.setAppElement('#root');


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <ModalProvider>
                <ToastContainer position="bottom-right"/>
                <App />
            </ModalProvider>
        </Provider>
    </StrictMode>
)
