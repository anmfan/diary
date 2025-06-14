import styles from "./styles.module.css"
import {useForm} from "react-hook-form";
import useAppSelectorsForLists from "@/hooks/useAppSelectorsForLists.ts";
import {TabsOptions} from "@/components/admin-management/types.ts";
import {checkTabIsGroups} from "@/components/admin-management-details/helper.ts";
import {useCreateScheduleMutation} from "@/redux/api/schedule-api.ts";
import useModal from "@/hooks/useModal.tsx";
import {toast} from "react-toastify";

type TAddScheduleForm = {
    excelImportFile: FileList | null;
    groupId: number | null;
}

const ModalAddSchedule = () => {
    const { selectedItem } = useAppSelectorsForLists(TabsOptions.groups);
    const currentGroup = checkTabIsGroups(selectedItem);
    const { closeModal } = useModal();
    const [ createSchedule ] = useCreateScheduleMutation();

    const { register, handleSubmit } = useForm<TAddScheduleForm>({
        defaultValues: {
            excelImportFile: null,
            groupId: currentGroup ? selectedItem.id : null,
        }
    })

    const handleSubmitForm = (data: TAddScheduleForm) => {
        const formData = new FormData()
        if (data.excelImportFile?.[0]) {
            formData.append("excelImportFile", data.excelImportFile[0])
        } else {
            return toast.error("Файл не выбран");
        }

        if (data.groupId !== null) {
            formData.append("groupId", data.groupId.toString());
        } else {
            return toast.error("Группа не выбрана");
        }

        createSchedule(formData)
        closeModal()
    }

    return (
        <div className={styles.modalWrapper}>
            <h2 className={styles.title}>Добавить расписания для группы <span>{currentGroup && selectedItem.name}</span></h2>

            <form onSubmit={handleSubmit(handleSubmitForm)} style={{display: "flex", flexDirection: "column"}}>
                <div className={styles.uploadSection}>
                    <label title="Добавить студентов через Excel файл" aria-label="Импортировать Excel файл" htmlFor="excel-upload" className={styles.customUpload}>
                        <img width={23} height={23} src="/ms-excel.svg" alt="Upload Excel" />
                    </label>
                    <input
                        {...register("excelImportFile")}
                        id="excel-upload"
                        type="file"
                        accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
                </div>
                <button type="submit" className={styles.submitBtn}>
                    Добавить
                </button>
            </form>
        </div>
    );
};

export default ModalAddSchedule;