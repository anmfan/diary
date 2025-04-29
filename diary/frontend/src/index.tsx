import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from '../src/components/app/App.tsx';
import {store} from "./redux/store/store.ts";
import {ToastContainer} from "react-toastify";
import Modal from "react-modal";

Modal.setAppElement('#root');


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <ToastContainer position="bottom-right"/>
            <App />
        </Provider>
    </StrictMode>
)
