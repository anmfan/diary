import useModal from "@/hooks/useModal.tsx";
import {useForm} from "react-hook-form";
import styles from './styles.module.css';
import {TAddStudentToGroup} from "@/redux/api/types.ts";
import {useAddStudentMutation} from "@/redux/api/teacher-management-api.ts";
import {toast} from "react-toastify";

const TeacherManagementAddStudent = ({currentGroupName}: {currentGroupName: string}) => {
    const { closeModal } = useModal();
    const [ addStudent ] = useAddStudentMutation()

    const { register, handleSubmit } = useForm<TAddStudentToGroup>({
        defaultValues: {
            fullName: '',
            email: '',
            role_id: 3,
            group_name: currentGroupName,
            excelImportFile: null,
        }
    });

    const handleSubmitForm = (formValues: TAddStudentToGroup) => {
        if (formValues instanceof FormData) {
            addStudent(formValues);
            closeModal();
            return;
        }

        const formData = new FormData();

        if (formValues.email.length < 3 && !formValues.excelImportFile) {
            toast.error('Введите email или загрузите файл');
            return;
        }

        formData.append('fullName', formValues.fullName);
        formData.append('email', formValues.email);
        formData.append('role_id', "3");
        formData.append('group_name', formValues.group_name);

        if (formValues.excelImportFile?.[0]) {
            formData.append("excelImportFile", formValues.excelImportFile[0]);
        }

        addStudent(formData)
        closeModal()
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit(handleSubmitForm)}>
            <h3 className={styles.title}>Добавить студента</h3>

            <label className={styles.label}>
                ФИО
                <input
                    {...register('fullName')}
                    type="text"
                    className={styles.input}
                />
            </label>

            <label className={styles.label}>
                Email
                <input
                    {...register('email')}
                    type="email"
                    className={styles.input}
                />
            </label>

            <label className={`${styles.label} ${styles.aboveTitle}`}>
                <span>Группа: {currentGroupName}</span>
                <label title="Добавить студентов через Excel файл" aria-label="Импортировать Excel файл" htmlFor="excel-upload" className={styles.customUpload}>
                    <img width={23} height={23} src="/ms-excel.svg" alt="Upload Excel" />
                </label>
                <input
                    {...register("excelImportFile")}
                    id="excel-upload"
                    type="file"
                    className={styles.customInput}
                    accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
            </label>

            <button type="submit" className={styles.submitBtn}>
                Сохранить
            </button>
        </form>
    );
};

export default TeacherManagementAddStudent;