import styles from './styles.module.css';
import otherStyles from "@/components/modal-add-group/styles.module.css"
import { useAppDispatch } from "@/hooks/store.ts";
import { useForm } from "react-hook-form";
import { formValidation } from "@/utils/formValidation.ts";
import useModal from "@/hooks/useModal.tsx";
import { generateLogin } from "@/components/modal-add-teacher/helpers.ts";
import { TModalAddTeacherStudentCommonType } from "@/components/modal-add-teacher-student-choose/const.ts";
import {IGroups, TCreateUser} from "@/redux/types.ts";
import useAppSelectorsForLists from "@/hooks/useAppSelectorsForLists.ts";
import {TabsOptions} from "@/components/admin-management/types.ts";
import {toast} from "react-toastify";

const ModalAddTeacherAndStudent = <T extends 2 | 3>({
                                                        roleId,
                                                        thunk
                                                    }: TModalAddTeacherStudentCommonType<T>) => {
    const dispatch = useAppDispatch();
    const { closeModal } = useModal();
    const { list } = useAppSelectorsForLists<"groups", IGroups[]>(TabsOptions.groups);

    const { register, handleSubmit, setValue } = useForm<TCreateUser<T>>({
        defaultValues: {
            username: '',
            fullName: '',
            email: '',
            password: '',
            role_id: roleId,
            group_id: ''
        }
    });

    const generatePassword = () => {
        const generated = Math.random().toString(15).slice(-13);
        setValue('password', generated);
    }

    const handleSubmitForm = async (data: TCreateUser<T>) => {
        const isValid = formValidation(data);
        if (!isValid) return;

        try {
            await dispatch(thunk(data)).unwrap();
        } catch (e) {
            toast.error(typeof e === 'string' ? e : 'Произошла ошибка');
        }
        closeModal();
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit(handleSubmitForm)}>
            <h3 className={styles.title}>Добавить {roleId === 2 ? "преподавателя" : "студента"}</h3>

            <label className={styles.label}>
                Логин
                <div className={styles.passwordRow}>
                    <input
                        {...register('username')}
                        type="text"
                        className={styles.input}
                        readOnly
                        required
                    />
                    <button
                        type="button"
                        className={styles.generateBtn}
                        onClick={() => generateLogin(setValue)}
                    >
                        Генерировать
                    </button>
                </div>
            </label>

            <label className={styles.label}>
                ФИО
                <input
                    {...register('fullName')}
                    type="text"
                    className={styles.input}
                    required
                />
            </label>

            <label className={styles.label}>
                Email
                <input
                    {...register('email')}
                    type="email"
                    className={styles.input}
                    required
                />
            </label>

            <label className={styles.label}>
                Группа
                <select {...register('group_id')} className={otherStyles.selector}>
                    <option value="">Выберите группу</option>
                    {list.map(group => (
                        <option key={group.id} value={group.id}>
                            {group.name}
                        </option>
                    ))}
                </select>
            </label>

            <label className={styles.label}>
                Пароль
                <div className={styles.passwordRow}>
                    <input
                        {...register('password')}
                        type="text"
                        className={styles.input}
                        readOnly
                        required
                    />
                    <button
                        type="button"
                        className={styles.generateBtn}
                        onClick={generatePassword}
                    >
                        Генерировать
                    </button>
                </div>
            </label>

            <button type="submit" className={styles.submitBtn}>
                Сохранить
            </button>
        </form>
    );
};

export default ModalAddTeacherAndStudent;