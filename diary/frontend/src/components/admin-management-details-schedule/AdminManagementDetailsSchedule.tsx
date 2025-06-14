import styles from "./styles.module.css";
import {useCallback, useEffect, useState} from "react";
import {TSelectedItem} from "@/components/admin-management/types.ts";
import {useGetSchedulesByGroupQuery} from "@/redux/api/schedule-api.ts";
import {checkTabIsGroups} from "@/components/admin-management-details/helper.ts";
import Spinner from "@/components/spinner/Spinner.tsx";
import {splittingLastName} from "@/components/admin-management-details-subjects/helpers.ts";
import AdminManagementScheduleTable
    from "@/components/admin-management-schedule-table/AdminManagementScheduleTable.tsx";
import {useScheduleWeek} from "@/components/schedule-week-context/ScheduleWeekContext.tsx";

const AdminManagementDetailsSchedule = ({ selectedItem }: {selectedItem: TSelectedItem}) => {
    const groupId = checkTabIsGroups(selectedItem) ? selectedItem.id : null;
    const { weekOffset, setWeekOffset } = useScheduleWeek()

    const { data, isLoading, refetch } = useGetSchedulesByGroupQuery({ groupId, weekOffset } , {skip: !groupId})
    const [weekRange, setWeekRange] = useState('');

    const getDateForDayIndex = useCallback((dayIndex: number) => {
        const now = new Date();
        const currentDay = now.getDay();

        const monday = new Date(now);
        monday.setDate(now.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
        monday.setDate(monday.getDate() + weekOffset * 7);

        const targetDate = new Date(monday);
        targetDate.setDate(monday.getDate() + dayIndex);

        return targetDate;
    }, [weekOffset]);

    const calculateWeekRange = useCallback(() => {
        const monday = getDateForDayIndex(0);
        const friday = getDateForDayIndex(4);

        const formatDate = (date: Date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            return `${day}.${month}.${date.getFullYear()}`;
        };

        return `${formatDate(monday)} – ${formatDate(friday)}`;
    }, [getDateForDayIndex]);

    const getLesson = useCallback((dayIndex: number, lessonNumber: number) => {
        if (!data) return null;

        const targetDate = getDateForDayIndex(dayIndex)
        const targetDateString = targetDate.toISOString().split('T')[0];

        const lesson = data.find(item => {
            const itemDate = new Date(item.date).toISOString().split('T')[0];
            return itemDate === targetDateString && item.lesson_number === lessonNumber;
        });

        if (!lesson) return null;

        const first_name = lesson.teacher?.user?.first_name || ""
        const last_name = lesson.teacher?.user?.last_name || ""

        return (
            <div className={styles.lessonCompact}>
                <div className={styles.subjectCompact}>{lesson.subject.name}</div>
                <div className={styles.classroomCompact}>{lesson.classroom}</div>
                <div className={styles.teacherCompact}>{first_name} {splittingLastName(last_name)}</div>
            </div>
        );
    },[data, getDateForDayIndex])

    useEffect(() => {
        setWeekRange(calculateWeekRange())
    },[calculateWeekRange, weekOffset])

    useEffect(() => {
        if (!groupId) refetch();
    },[groupId, refetch, weekOffset])

    if (isLoading) return <Spinner />

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.weekNav}>
                    <button
                        className={styles.navButton}
                        onClick={() => setWeekOffset(prev => prev - 1)}
                        aria-label="Предыдущая неделя"
                    >
                        <svg className={styles.arrowIcon} viewBox="0 0 24 24">
                            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
                        </svg>
                    </button>
                    <span style={{userSelect: "none"}}>{weekRange}</span>
                    <button
                        className={styles.navButton}
                        onClick={() => setWeekOffset(prev => prev + 1)}
                        aria-label="Следующая неделя"
                    >
                        <svg className={styles.arrowIcon} viewBox="0 0 24 24">
                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                        </svg>
                    </button>
                </div>
            </div>

            {data?.length === 0 && <span className={styles.emptySchedules}>Расписания на эту неделю нет</span>}
            {data?.length !== 0 && <AdminManagementScheduleTable getLesson={getLesson}/>}
        </div>
    );
};

export default AdminManagementDetailsSchedule;