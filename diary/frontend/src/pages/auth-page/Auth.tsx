import styles from './auth.module.css';
import AuthTooltip from "@/components/auth-tooltip/AuthTooltip.tsx";
import {useAppDispatch} from "@/hooks/store.ts";
import { useForm } from "react-hook-form";
import {login} from "@/redux/thunks/user-thunk.ts";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from "react-router-dom";
import {ROUTES_ENDPOINTS} from "@/components/routes/const.tsx";


const Auth = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm({
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const submitForm = async (data: {email: string, password: string}) => {
        if (data.email.length === 0) {
            return toast.error("Введите email");
        }
        if (data.password.length === 0) {
            return toast.error("Введите пароль");
        }
        if (data.password.length > 0 && data.password.length < 6) {
            return toast.error("Пароль должен состоять минимум из 6 символов");
        }
        try {
            dispatch(login(data));
            navigate(ROUTES_ENDPOINTS.HOME)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h2 className={styles.title}>Вход в систему</h2>
                <form onSubmit={handleSubmit(submitForm)}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label} htmlFor="email">Email</label>
                        <input
                            autoComplete={'email'}
                            className={styles.input}
                            type="email"
                            id="email"
                            placeholder="Email"
                            {...register("email")}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <div className={styles.message}>
                            <label className={styles.label} htmlFor="password">Пароль</label>
                            <AuthTooltip/>
                        </div>
                        <input
                            className={styles.input}
                            autoComplete={'password'}
                            type="password"
                            id="password"
                            placeholder="Пароль"
                            {...register("password")}
                        />
                    </div>
                    <button
                        className={styles.submitButton}
                    >
                        Войти</button>
                </form>
            </div>
        </div>
    );
};

export default Auth;