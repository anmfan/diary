import styles from '../modal-add-teacher/styles.module.css';
import {useAppDispatch, useAppSelector} from "@/hooks/store.ts";
import { useForm } from "react-hook-form";
import useModal from "@/hooks/useModal.tsx";
import {selectSelectedItem} from "@/redux/selectors/user-selector.ts";
import useSetSelectedItem from "@/hooks/useSetSelectedItem.ts";
import {isSubject} from "@/components/admin-management-details/helper.ts";
import { TGroupEdit, TSubjectEdit } from "@/redux/types.ts";
import { TModalEditGroupSubjectCommonType } from "@/components/modal-edit-teacher-student-choose/const.ts";

const ModalEditGroupAndSubject = ({type, entityName, entityId, thunk}: TModalEditGroupSubjectCommonType) => {
    const dispatch = useAppDispatch();
    const { closeModal } = useModal();
    const selectedItem = useAppSelector(selectSelectedItem)
    const { setSelected } = useSetSelectedItem();

    const { register, handleSubmit } = useForm<TGroupEdit | TSubjectEdit>({
        defaultValues: {
            [entityId]: selectedItem!.id,
            [entityName]: isSubject(selectedItem) ? selectedItem.name : '',
        }
    });

    const handleSubmitForm = (data: TGroupEdit | TSubjectEdit) => {
        if (type === 'group') {
            dispatch(thunk(data as TGroupEdit));
        } else {
            dispatch(thunk(data as TSubjectEdit));
        }
        setSelected(null)
        closeModal();
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit(handleSubmitForm)}>
            <h3 className={styles.title}>Редактирование</h3>

            <label className={styles.label}>
                Название
                <input
                    {...register(entityName)}
                    type="text"
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

export default ModalEditGroupAndSubject;