import styles from "./styles.module.css";
import formStyles from "@/components/modal-add-teacher/styles.module.css";
import selectStyles from "@/components/modal-add-group/styles.module.css";
import {checkTabIsGroups} from "@/components/admin-management-details/helper.ts";
import useGetCachedGroupData from "@/hooks/useCachedGroupData.tsx";
import {useAppSelector} from "@/hooks/store.ts";
import {selectSelectedItem} from "@/redux/selectors/user-selector.ts";
import {useMemo,} from "react";
import {TScheduleGroups} from "@/redux/api/types.ts";
import {formatDate} from "@/pages/diary-page/helper.ts";
import {useScheduleWeek} from "@/components/schedule-week-context/ScheduleWeekContext.tsx";
import {useForm} from "react-hook-form";
import {useDeleteScheduleMutation, useEditScheduleMutation} from "@/redux/api/schedule-api.ts";
import useModal from "@/hooks/useModal.tsx";

export type TEditScheduleForm = {
    classroom: string;
    selectedSubjectId: string;
    selectedDay: string;
    lesson_number: number | null;
    weekOffset?: number;
}

const ModalEditSchedule = () => {
    const { weekOffset } = useScheduleWeek();
    const [ deleteSchedule ] = useDeleteScheduleMutation();
    const [ editSchedule ] = useEditScheduleMutation();
    const { closeModal } = useModal()

    const { register, handleSubmit, getValues, watch } = useForm<TEditScheduleForm>({
        defaultValues: {
            classroom: "",
            selectedSubjectId: "",
            selectedDay: "",
            lesson_number: null
        }
    })

    const selectedItem = useAppSelector(selectSelectedItem);
    const group = checkTabIsGroups(selectedItem);
    const groupId = group ? selectedItem?.id : null;

    const { data } = useGetCachedGroupData({ groupId, weekOffset });

    const daysMap = useMemo(() => {
        const map = new Map<string, TScheduleGroups<"teacher">[]>();
        data?.forEach((item) => {
            if (!map.has(item.date)) map.set(item.date, []);
            map.get(item.date)!.push(item);
        });
        return map;
    }, [data]);

    const selectedDayForm = watch("selectedDay");
    const selectedSubjectIdForm = watch("selectedSubjectId");

    const subjectsForSelectedDay = useMemo(() =>
        selectedDayForm ? daysMap.get(selectedDayForm) || [] : [], [daysMap, selectedDayForm]);

    const selectedLesson = useMemo(() => {
        const [subjectIdStr, subjectLessonNumberStr] = selectedSubjectIdForm.split("-");
        const subjectId = Number(subjectIdStr);
        const lesson_number = Number(subjectLessonNumberStr);

        return subjectsForSelectedDay.find(
            (item) =>
                item.subjectId === subjectId
                && item.lesson_number === lesson_number
        ) || null;
    }, [subjectsForSelectedDay, selectedSubjectIdForm]);

    const handleSubmitForm = (data: TEditScheduleForm) => {
        const editedSelectedSubjectId = getValues("selectedSubjectId").split("-")[0];
        const editedLessonNumber = Number(getValues("selectedSubjectId").split("-")[1]);

        editSchedule({
            ...data,
            selectedSubjectId: editedSelectedSubjectId,
            lesson_number: editedLessonNumber,
            groupId
        })
        closeModal();
    }

    const deleteScheduleFunc = () => {
        const deletedSelectedSubjectId = getValues("selectedSubjectId").split("-")[0];
        const deletedSelectedDay = getValues("selectedDay");

        deleteSchedule({
            selectedSubjectId: deletedSelectedSubjectId,
            selectedDay: deletedSelectedDay,
            groupId: groupId,
            weekOffset
        })
        closeModal();
    }

    if (data?.length === 0) return <div style={{padding: "15px", textAlign: "center"}}><span>Расписаний нет</span></div>

    return (
        <>
        <form className={formStyles.form} onSubmit={handleSubmit(handleSubmitForm)}>
            <h3 className={formStyles.title}>Редактирование</h3>

            <div className={styles.lessonInfo}>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Группа:</span>
                    <span className={styles.infoValue}>{group && selectedItem.name}</span>
                </div>
            </div>

            <label className={formStyles.label} htmlFor="selectedDay">
                День
                <select
                    className={selectStyles.selector}
                    id="selectedDay"
                    {...register("selectedDay")}
                >
                    <option value="">Выберите день</option>
                    {[...daysMap.keys()].map((date) => (
                        <option key={date} value={date}>
                            {formatDate(date)}
                        </option>
                    ))}
                </select>
            </label>

            <label className={formStyles.label} htmlFor="selectedSubjectId">
                Предмет
                <div className={styles.selectWrapper}>
                    <select
                        className={selectStyles.selector}
                        id="selectedSubjectId"
                        {...register("selectedSubjectId")}
                        disabled={!selectedDayForm}
                    >
                        <option value="">Выберите предмет</option>
                        {subjectsForSelectedDay.map((item) => (
                            <option key={item.id} value={`${item.subjectId}-${item.lesson_number}`}>
                                {item.subject.name}
                            </option>
                        ))}
                    </select>
                </div>
            </label>

            <label className={formStyles.label} htmlFor="classroom">
                Аудитория
                <input
                    className={formStyles.input}
                    id="classroom"
                    {...register("classroom")}
                    placeholder="Введите номер аудитории"
                    disabled={!selectedLesson}
                />
            </label>

            <button
                className={formStyles.submitBtn}
                style={{marginTop: "0"}}
                disabled={!selectedLesson}
                type="submit"
            >
                Сохранить изменения
            </button>
        </form>
            <button
                className={styles.deleteBtn}
                disabled={!selectedLesson}
                onClick={deleteScheduleFunc}
            >
                Удалить урок
            </button>
        </>
    );
};

export default ModalEditSchedule;