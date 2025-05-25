import styles from './styles.module.css';
import {useAppDispatch} from "@/hooks/store.ts";
import {useForm} from "react-hook-form";
import useModal from "@/hooks/useModal.tsx";
import {createSubject} from "@/redux/thunks/subjects-thunk.ts";
import {toast} from "react-toastify";

const ModalAddSubject = () => {
    const dispatch = useAppDispatch();
    const { closeModal } = useModal()
    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: '',
        }
    });

    const handleSubmitForm = async (data: { name: string }) => {
        if (data.name.length < 3) {
            return toast.error("Название предмета должно быть минимум 3 символа");
        }
        try {
            await dispatch(createSubject(data)).unwrap()
        } catch (e) {
            toast.error(typeof e === 'string' ? e : 'Произошла ошибка');
        }
        closeModal()
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit(handleSubmitForm)}>
            <h3 className={styles.title}>Добавить предмет</h3>

            <label className={styles.label}>
                Название
                <input
                    {...register('name')}
                    type="text"
                    className={styles.input}
                    name="name"
                    required />
            </label>

            <button type="submit" className={styles.submitBtn}>
                Сохранить
            </button>
        </form>
    );
};

export default ModalAddSubject;