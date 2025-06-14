import styles from '../modal-add-teacher/styles.module.css';
import {useAppDispatch, useAppSelector} from "@/hooks/store.ts";
import { useForm } from "react-hook-form";
import useModal from "@/hooks/useModal.tsx";
import {edit} from "@/redux/thunks/user-thunk.ts";
import {TEdit} from "@/redux/types.ts";
import {selectSelectedItem} from "@/redux/selectors/user-selector.ts";
import {isTeacher, isStudent, isUser, mappingGroups} from "@/components/Modal-edit-teacher-and-student/helper.tsx";
import useSetSelectedItem from "@/hooks/useSetSelectedItem.ts";
import {toast} from "react-toastify";
import ModalEditAddGroup from "@/components/modal-edit-add-group/ModalEditAddGroup.tsx";

const ModalEditTeacherAndStudent = () => {
    const dispatch = useAppDispatch();
    const { closeModal } = useModal();
    const selectedItem = useAppSelector(selectSelectedItem)
    const { setSelected } = useSetSelectedItem();

    const user = isUser(selectedItem);

    const userFullName = user && selectedItem.first_name
            ? `${selectedItem.first_name} ${selectedItem.last_name}`
            : ''

    const userEmail = user ? selectedItem.email : '';
    const userId = user ? selectedItem.id : 0;

    const { register, handleSubmit } = useForm<TEdit>({
        defaultValues: {
            fullName: userFullName,
            group: '',
            email: userEmail,
        }
    });

    const handleSubmitForm = async (data: TEdit) => {
        try {
            await dispatch(edit({...data, id: userId})).unwrap();
        } catch (error) {
            toast.error(typeof error === 'string' && error  ||'Произошла ошибка');
        }
        setSelected(null)
        closeModal();
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit(handleSubmitForm)}>
            <h3 className={styles.title}>Редактирование</h3>

            <label className={styles.label}>
                ФИО
                <input
                    {...register('fullName')}
                    type="text"
                    className={styles.input}
                    required
                />
            </label>

            <div className={styles.groupSection}>
                {
                    (isTeacher(selectedItem)
                    || (isStudent(selectedItem) && !selectedItem.group))
                    && <ModalEditAddGroup item={selectedItem} />}
                <span style={{rowGap: "10px"}} className={styles.label}>
                    Группа: {mappingGroups(selectedItem)}
                </span>
            </div>

            <label className={styles.label}>
                Email
                <input
                    {...register('email')}
                    type="email"
                    className={styles.input}
                    required
                />
            </label>

            <button type="submit" className={styles.submitBtn}>
                Сохранить
            </button>
        </form>
    );
};

export default ModalEditTeacherAndStudent;