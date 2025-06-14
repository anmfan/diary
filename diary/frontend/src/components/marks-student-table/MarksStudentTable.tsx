import styles from "./styles.module.css"
import {useEffect, useState} from "react";
import {
    useGetGroupSubjectsQuery,
    useGetMarksByStudentQuery,
} from "@/redux/api/schedule-api.ts";
import {TUserInfo} from "@/redux/types.ts";
import Spinner from "@/components/spinner/Spinner.tsx";
import {compareDates} from "@/pages/diary-page/helper.ts";
import { motion } from "motion/react";
import {formatDateShort} from "@/components/marks-table/helpers.ts";

const MarksStudentTable = ({ user }: {user: TUserInfo}) => {
    const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
    const [lessonDates, setLessonDates] = useState<string[]>([]);
    const [error, setError] = useState('');

    const email = user.email;

    const {
        data: marksData,
        isLoading: marksIsLoading,
        refetch: refetchMarks,
        isError: marksError
    } = useGetMarksByStudentQuery(
        { email, subjectId: selectedSubject },
        { skip: !user.email || !selectedSubject }
    )

    const {
        data: subjectsData,
        isLoading: subjectsIsLoading,
        isError: subjectsError
    } = useGetGroupSubjectsQuery(
        { groupId: user.group },
        { skip: !user.group }
    )

    useEffect(() => {
        if (subjectsData && subjectsData.length > 0 && selectedSubject === null) {
            setSelectedSubject(subjectsData[0].subjectId);
        }
    }, [subjectsData, selectedSubject]);

    useEffect(() => {
        if (selectedSubject && email) {
            refetchMarks();
        }
    }, [selectedSubject, email, refetchMarks]);

    useEffect(() => {
        if (!marksData) {
            setLessonDates([]);
            return;
        }

        const uniqueDates = Array.from(
            new Set(marksData.marks.map(mark => mark.date))
        );

        const sortedDates = uniqueDates.sort(compareDates);
        setLessonDates(sortedDates);
    }, [marksData]);

    useEffect(() => {
        if (subjectsError) {
            setError('Ошибка загрузки данных о предметах');
        } else if (marksError) {
            setError('Ошибка загрузки оценок');
        } else {
            setError('');
        }
    }, [subjectsError, marksError]);

    if (marksIsLoading || subjectsIsLoading) return <Spinner />

    if (!subjectsData || subjectsData.length === 0) {
        return <div className={styles.noStudentsMessage}>У студента нет предметов</div>;
    }

    const calcAvgMark = () => {
        const marksNumbers = marksData?.marks.filter(mark => mark.value !== "н");
        const sumNumberMarks = marksNumbers?.reduce((sum, mark) => sum + Number(mark.value), 0);
        if (sumNumberMarks && marksNumbers) {
            return (sumNumberMarks / marksNumbers.length).toFixed(2);
        } else {
            return "Не удалось подсчитать среднюю оценку"
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={styles.table}
        >
            <h1 className={styles.title}>Журнал оценок</h1>

            <div className={styles.controls}>
                <label htmlFor="subject-select" className={styles.label}>
                    Выберите предмет:
                </label>
                <select
                    id="subject-select"
                    value={selectedSubject !== null ? selectedSubject.toString() : ""}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSelectedSubject(value ? parseInt(value, 10) : null);
                    }}
                    className={styles.select}
                >
                    {subjectsData.map((subject) => (
                        <option
                            key={subject.subjectId}
                            value={subject.subjectId.toString()}
                        >
                            {subject.subjectName}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.gradeTable}>
                    <thead>
                    <tr>
                        <th className={styles.studentHeader}>Предмет</th>
                        {lessonDates.map(date => (
                            <th key={date} className={styles.dateHeader}>
                                {formatDateShort(date)}
                            </th>
                        ))}
                        <th className={styles.dateHeader}>Средний балл</th>
                    </tr>
                    </thead>
                    <tbody>
                    {selectedSubject && marksData ? (
                        <tr>
                            <td className={styles.studentCell}>
                                {marksData.subjectName}
                            </td>

                            {lessonDates.map(date => {
                                const marksForDate = marksData.marks.filter(
                                    m => m.date === date
                                );

                                return (
                                    <td key={date} className={styles.gradeCell}>
                                        <div className={styles.marksContainer}>
                                            {marksForDate.length > 0 ? (
                                                marksForDate.map((mark, index) => (
                                                    <div
                                                        key={index}
                                                        className={styles.gradeCell}
                                                        data-grade={mark.value}
                                                    >
                                                        {mark.value}
                                                    </div>
                                                ))
                                            ) : "-"}
                                        </div>
                                    </td>
                                );
                            })}

                            <td className={styles.avgCell}>
                                {marksData.marks.length > 0
                                    ? calcAvgMark()
                                    : "Нет оценок"}
                            </td>
                        </tr>
                    ) : (
                        <tr>
                            <td
                                colSpan={lessonDates.length + 2}
                                className={styles.noDataCell}
                            >
                                {selectedSubject
                                    ? marksIsLoading
                                        ? "Загрузка оценок..."
                                        : "Нет оценок по выбранному предмету"
                                    : "Выберите предмет"}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {error && <div className={styles.error}>{error}</div>}
        </motion.div>

    );
};

export default MarksStudentTable;