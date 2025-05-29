import styles from './styles.module.css';
import otherStyles from "@/components/modal-add-group/styles.module.css"
import {useAppDispatch, useAppSelector} from "@/hooks/store.ts";
import { useForm } from "react-hook-form";
import useModal from "@/hooks/useModal.tsx";
import { TModalAddTeacherStudentCommonType } from "@/components/modal-add-teacher-student-choose/const.ts";
import {IGroups, IUserReturnedGroupData, TCreateUser} from "@/redux/types.ts";
import useAppSelectorsForLists from "@/hooks/useAppSelectorsForLists.ts";
import {TabsOptions} from "@/components/admin-management/types.ts";
import {toast} from "react-toastify";
import {groupsWithoutCurator} from "@/redux/selectors/groups-selector.ts";

const ModalAddTeacherAndStudent =
    <
        T extends 2 | 3,
        F extends IUserReturnedGroupData | string | null
    >({
         roleId,
         thunk
    }: TModalAddTeacherStudentCommonType<T, F>) => {
    const dispatch = useAppDispatch();
    const { closeModal } = useModal();
    const { list } = useAppSelectorsForLists<"groups", IGroups[]>(TabsOptions.groups);
    const groupsListWithoutCurator = useAppSelector(groupsWithoutCurator);

    const mapList = roleId === 2 ? groupsListWithoutCurator : list;

    const { register, handleSubmit } = useForm<TCreateUser<T>>({
        defaultValues: {
            fullName: '',
            email: '',
            role_id: roleId,
            group_id: ''
        }
    });

    const handleSubmitForm = async (data: TCreateUser<T>) => {
        if (data.email.length < 3) {
            return toast.error('Введите email');
        }

        try {
            await dispatch(thunk(data)).unwrap();
        } catch (e) {
            toast.error(typeof e === 'string' && e);
        }
        closeModal();
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit(handleSubmitForm)}>
            <h3 className={styles.title}>Добавить {roleId === 2 ? "преподавателя" : "студента"}</h3>

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
                    {mapList.map(group => (
                        <option key={group.id} value={group.id}>
                            {group.name}
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

export default ModalAddTeacherAndStudent;