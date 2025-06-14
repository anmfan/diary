import {useForm} from "react-hook-form";
import styles from "./styles.module.css";
import {toast} from "react-toastify";
import useModal from "@/hooks/useModal.tsx";
import {useAppDispatch} from "@/hooks/store.ts";
import {newPassword} from "@/redux/thunks/user-thunk.ts";

const ForgotPassword = () => {
    const { register, handleSubmit } = useForm<{ email: string }>();
    const { closeModal } = useModal()
    const dispatch = useAppDispatch();

    const onSubmit = async (email: string) => {
        try {
            const data = dispatch(newPassword({ email }))
            console.log('data', data)
            closeModal()
        } catch (e) {
            toast.error(typeof e === 'string' ? e : "Произошла ошибка")
        }
    }

    return (
        <form onSubmit={handleSubmit(({ email }) => onSubmit(email))} className={styles.form}>
            <h2 className={styles.title}>Восстановление пароля</h2>

            <label className={styles.label} htmlFor="email">
                Введите ваш Email для отправки нового пароля
            </label>
            <input
                type="email"
                id="email"
                {...register("email", { required: true })}
                className={styles.input}
                placeholder="example@mail.com"
                autoComplete="email"
            />

            <button type="submit" className={styles.submitButton}>
                Отправить
            </button>
        </form>
    );
};

export default ForgotPassword;