import styles from '../modal-add-teacher/styles.module.css';
import otherStyles from '@/components/modal-add-group/styles.module.css';
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
import {groupsWithoutSubjects} from "@/redux/selectors/groups-selector.ts";
import {teacherWithoutSubject} from "@/redux/selectors/teachers-selector.ts";

const ModalEditGroupAndSubject = ({type, entityName, entityId, thunk}: TModalEditGroupSubjectCommonType) => {
    const dispatch = useAppDispatch();
    const { closeModal } = useModal();
    const selectedItem = useAppSelector(selectSelectedItem)
    const { setSelected } = useSetSelectedItem();
    const groupsList = useAppSelector(groupsWithoutSubjects(selectedItem!.id))
    const teachersList = useAppSelector(teacherWithoutSubject(selectedItem!.id))

    const selectedItemId = selectedItem!.id;
    const tabIsSubject = isSubject(selectedItem);
    const teachersOfSubject = tabIsSubject ? selectedItem.teachers : []

    const { register, handleSubmit, watch } = useForm<TGroupEdit | TSubjectEdit>({
        defaultValues: {
            [entityId]: selectedItemId,
            [entityName]: tabIsSubject ? selectedItem.name : '',
            group_id: '',
            teacher_id: '',
            subjectTeacherId: '',
            excelImportFile: null
        }
    });

    const groupIsSelected = watch("group_id")

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
            formData.append('group_id', subjectData.group_id);
            formData.append('teacher_id', subjectData.teacher_id);
            formData.append('subjectTeacherId', subjectData.subjectTeacherId);
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
                <div className={styles.label}>
                    <div className={styles.aboveTitle}>
                        <span>Студенты группы</span>
                        <label title="Добавить студентов через Excel файл" aria-label="Импортировать Excel файл" htmlFor="excel-upload" className={styles.customUpload}>
                            <img width={23} height={23} src="/ms-excel.svg" alt="Upload Excel" />
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
            )}

            {type === 'subject' && (
                <>
                    {teachersOfSubject.length > 0 && (
                        <label className={styles.label}>
                            Привязать к группе
                            <select className={otherStyles.selector}{...register("group_id")}>
                                {groupsList.map(group => (
                                    <option key={group.id} value={group.id}>{group.name}</option>
                                ))}
                            </select>
                        </label>
                    )}
                    {teachersOfSubject.length === 0 && <span>Для привязки группы, необходим преподаватель</span>}

                    {groupIsSelected !== "" && teachersOfSubject.length > 0 && (
                        <label className={styles.label}>
                            Выбрать преподавателя предмета
                            <select className={otherStyles.selector} {...register("subjectTeacherId")} required>
                                {teachersOfSubject.map(({id, user: {first_name, last_name}}) => (
                                    <option key={id} value={id}>{first_name && first_name + " " + last_name}</option>
                                ))}
                            </select>
                        </label>
                    )}

                    <label className={styles.label}>
                        Прикрепить преподавателя
                        <select className={otherStyles.selector} {...register("teacher_id")}>
                            {teachersList.map(teacher => (
                                <option
                                    key={teacher.id}
                                    value={teacher.id}
                                >
                                    {teacher.first_name && teacher.first_name + " " + teacher.last_name}
                                </option>
                            ))}
                        </select>
                    </label>
                </>
            )}

            <button type="submit" className={styles.submitBtn}>
                Сохранить
            </button>
        </form>
    );
};

export default ModalEditGroupAndSubject;