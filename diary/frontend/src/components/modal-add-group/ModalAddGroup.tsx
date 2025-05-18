import styles from './styles.module.css';
import {useAppDispatch} from "@/hooks/store.ts";
import {useForm} from "react-hook-form";
import useModal from "@/hooks/useModal.tsx";
import {createGroup, TCreateGroup} from "@/redux/thunks/groups-thunk.ts";
import useAppSelectorsForLists from "@/hooks/useAppSelectorsForLists.ts";
import {TabsOptions }  from "@/components/admin-management/types.ts";
import { ITeacher } from "@/redux/types.ts";
import { fioIsExist } from '@/components/admin-management-details/helper.ts';

const ModalAddTeacher = () => {
    const dispatch = useAppDispatch();
    const { closeModal } = useModal()
    const { list } = useAppSelectorsForLists<"teachers", ITeacher[]>(TabsOptions.teachers);

    const { register, handleSubmit } = useForm<TCreateGroup>({
        defaultValues: {
            name: '',
            course: 0,
            curator_id: null,
        }
    });

    const handleSubmitForm = (data: TCreateGroup) => {
        dispatch(createGroup(data))
        closeModal()
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit(handleSubmitForm)}>
            <h3 className={styles.title}>Добавить группу</h3>

            <label className={styles.label}>
                Название
                <input
                    {...register('name')}
                    type="text"
                    className={styles.input}
                    required
                />
            </label>

            <label className={styles.label}>
                Курс
                <select {...register('course')} className={styles.selector} required>
                    <option value="">Выберите курс</option>
                    {new Array(4).fill(0).map((_, index) => (
                        <option key={index + 1} value={index + 1}>{index + 1}</option>
                    ))}
                </select>
            </label>

            <label className={styles.label}>
                Куратор (необязательно)
                <select {...register('curator_id')} className={styles.selector}>
                    <option value="">Выберите куратора</option>
                    {list.map(teacher => (
                        <option
                            key={teacher.id}
                            value={teacher.id}
                        >
                            {fioIsExist(
                                teacher.first_name!,
                                teacher.last_name!,
                                teacher.email,
                                "group",
                                teacher
                            )}
                        </option>
                    ))}
                </select>
            </label>

            <button type="submit" className={styles.submitBtn}>
                Сохранить
            </button>
        </form>
    );
};

export default ModalAddTeacher;