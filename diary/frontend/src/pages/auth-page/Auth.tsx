import styles from './auth.module.css';
import AuthTooltip from "@/components/auth-tooltip/AuthTooltip.tsx";
import {useAppDispatch} from "@/hooks/store.ts";
import {login} from "@/redux/thunks/user-thunk.ts";
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from "react-router-dom";
import {ROUTES_ENDPOINTS} from "@/components/routes/const.tsx";
import {formValidation} from "@/utils/formValidation.ts";
import {toast} from "react-toastify";
import {useForm} from "react-hook-form";


const Auth = () => {
    const dispatch = useAppDispatch();
    // const { modalIsOpen ,openModal } = useModal();
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm({
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const submitForm = async (data: {email: string, password: string}) => {
        const isValid = formValidation(data);
        if (!isValid) return;

        try {
            await dispatch(login(data)).unwrap();
            navigate(ROUTES_ENDPOINTS.HOME)
        } catch (error) {
            toast.error(typeof error === 'string' ? error : 'Произошла ошибка');
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
                            autoComplete='email'
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
                            autoComplete='password'
                            type="password"
                            id="password"
                            placeholder="Пароль"
                            {...register("password")}
                        />
                    </div>
                    <button type="submit" className={styles.submitButton}>Войти</button>
                </form>
                {/*<button onClick={() => openModal(<ForgotPassword />)} type="button" className={styles.forgotPassword }>*/}
                {/*    Зыбыли пароль?*/}
                {/*</button>*/}
                {/*{modalIsOpen && <AdminManagementModal />}*/}
            </div>
        </div>
    );
};

export default Auth;