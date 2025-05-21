import styles from '../modal-add-teacher/styles.module.css';
import listStyles from '@/pages/management-page/management.module.css';
import {useAppDispatch, useAppSelector} from "@/hooks/store.ts";
import { useForm } from "react-hook-form";
import useModal from "@/hooks/useModal.tsx";
import {selectSelectedItem} from "@/redux/selectors/user-selector.ts";
import useSetSelectedItem from "@/hooks/useSetSelectedItem.ts";
import {isSubject} from "@/components/admin-management-details/helper.ts";
import { TGroupEdit, TSubjectEdit } from "@/redux/types.ts";
import { TModalEditGroupSubjectCommonType } from "@/components/modal-edit-teacher-student-choose/const.ts";
import ModalEditGroupAndSubjectListStudents
    from "@/components/modal-edit-group-and-subject-list-students/modalEditGroupAndSubjectListStudents.tsx";

const ModalEditGroupAndSubject = ({type, entityName, entityId, thunk}: TModalEditGroupSubjectCommonType) => {
    const dispatch = useAppDispatch();
    const { closeModal } = useModal();
    const selectedItem = useAppSelector(selectSelectedItem)
    const { setSelected } = useSetSelectedItem();

    const selectedItemId = selectedItem!.id;

    const { register, handleSubmit } = useForm<TGroupEdit | TSubjectEdit>({
        defaultValues: {
            [entityId]: selectedItemId,
            [entityName]: isSubject(selectedItem) ? selectedItem.name : '',
            excelImportFile: null
        }
    });

    const handleSubmitForm = (data: TGroupEdit | TSubjectEdit) => {
        const formData = new FormData();

        if (type === "group") {
            const groupData = data as TGroupEdit;
            formData.append('groupId', groupData.groupId);
            formData.append('newGroupName', groupData.newGroupName);
        } else {
            const subjectData = data as TSubjectEdit;
            formData.append('subjectId', subjectData.subjectId);
            formData.append('newSubjectName', subjectData.newSubjectName);
        }

        if (data.excelImportFile?.[0]) {
            formData.append("excelImportFile", data.excelImportFile[0]);
        }

        dispatch(thunk(formData));
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

            {type === 'group' && (
                <>
                <div className={styles.label}>
                    <div className={styles.aboveTitle}>
                        <span>Студенты группы</span>
                        <label title="Добавить студентов через Excel файл" aria-label="Импортировать Excel файл" htmlFor="excel-upload" className={styles.customUpload}>
                            <img width={23} height={23} src="public/ms-excel.svg" alt="Upload Excel" />
                        </label>
                        <input
                            {...register("excelImportFile")}
                            id="excel-upload"
                            type="file"
                            accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
                    </div>
                    <div className={`${listStyles.listContainer} ${styles.modalListContainer}`}
                         style={{marginTop: '0.3rem', display: 'flex', flexDirection: 'column', rowGap: '1rem'}}>
                        <ModalEditGroupAndSubjectListStudents selectedItemId={selectedItemId}/>
                    </div>
                </div>
                </>
            )}

            <button type="submit" className={styles.submitBtn}>
                Сохранить
            </button>
        </form>
    );
};

export default ModalEditGroupAndSubject;