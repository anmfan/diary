import { motion } from 'motion/react';
import styles from './styles.module.css';
import MainContainer from "@/components/main-container/MainContainer.tsx";
import {useGetScheduleByTeacherQuery, useGetSchedulesByGroupQuery} from "@/redux/api/schedule-api.ts";
import {useAppSelector} from "@/hooks/store.ts";
import {userFIO} from "@/redux/selectors/user-selector.ts";
import {useEffect, useMemo, useState} from "react";
import {formatDate, getDayName, RoleBasedSchedule} from "@/pages/diary-page/helper.ts";
import DiaryLessonsList from "@/components/diary-lessons-list/DiaryLessonsList.tsx";
import Spinner from "@/components/spinner/Spinner.tsx";
import {UsersRoles} from "@/redux/slices/user-slice.ts";

const Diary = () => {
    const user = useAppSelector(userFIO);
    const isTeacher = user.role === UsersRoles.teacher;
    const isStudent = user.role === UsersRoles.student;

    const [weekDays, setWeekDays] = useState<string[]>([]);

    const { data: studentData, isLoading: studentLoading } = useGetSchedulesByGroupQuery(
        { groupId: user.group, weekOffset: 0 },
        { skip: !user.group || !isStudent }
    );

    const { data: teacherData, isLoading: teacherLoading } = useGetScheduleByTeacherQuery(
        { email: user.email, weekOffset: 0 },
        { skip: !user.email || !isTeacher }
    );

    const data = isStudent ? studentData : teacherData;
    const isLoading = isStudent ? studentLoading : teacherLoading;

    const groupedSchedule = useMemo(() => {
        type Item = RoleBasedSchedule<typeof user.role>;
        const grouped: Record<string, Item[]> = {};

        weekDays.forEach(date => {
            grouped[date] = [];
        });

        (data as Item[])?.forEach(lesson => {
            const date = lesson.date;
            if (grouped[date]) {
                grouped[date].push(lesson);
            }
        });

        Object.keys(grouped).forEach(date => {
            grouped[date].sort((a, b) => a.lesson_number - b.lesson_number);
        });

        return grouped;
    }, [data, user, weekDays]);

    useEffect(() => {
        const today = new Date();
        const dayOfWeek = today.getDay();

        const monday = new Date(today);
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

        const days = Array.from({ length: 5 }, (_, i) => {
            const nextDay = new Date(monday);
            nextDay.setDate(monday.getDate() + i);
            return nextDay.toISOString().split('T')[0];
        });

        setWeekDays(days);
    }, []);

    const displayData = weekDays.map(date => ({
        date,
        day: getDayName(date),
        lessons: groupedSchedule[date] || [],
        formattedDate: formatDate(date)
    }));

    if (isLoading) {
        return (
            <MainContainer>
                <div className={styles.header}>
                    <Spinner />
                </div>
            </MainContainer>
        );
    }

    return (
        <MainContainer>
            <div className={styles.header}>
                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className={styles.titleIcon}>Ваш дневник</span>
                </motion.h1>
            </div>

            <div className={styles.grid}>
                <DiaryLessonsList displayData={displayData}/>
            </div>
        </MainContainer>
    );
};

export default Diary;