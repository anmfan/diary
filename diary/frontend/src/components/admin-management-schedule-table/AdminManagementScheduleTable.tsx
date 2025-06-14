import styles from "./styles.module.css";
import {days, lessonTimes} from "@/const.ts";
import {JSX} from "react";

type TGetLessonFunc = {
    getLesson: (dayIndex: number, lessonNumber: number) => (JSX.Element | null);
}

const AdminManagementScheduleTable = ({ getLesson }: TGetLessonFunc) => {
    return (
        <table className={styles.scheduleTable}>
            <thead>
            <tr>
                <th className={styles.timeColumn}>Время</th>
                {days.map(day => (
                    <th key={day} className={styles.dayHeader}
                    >
                        {day}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {lessonTimes.map((time, lessonIndex) => (
                <tr key={lessonIndex} className={`${styles.tableRow} ${lessonIndex % 2 === 0 ? styles.evenRow : styles.oddRow}`}>
                    <td className={styles.timeCell}>{time}</td>
                    {days.map((_, dayIndex) => (
                        <td
                            key={dayIndex}
                            className={styles.lessonCell}
                        >
                            {getLesson(dayIndex, lessonIndex + 1)}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default AdminManagementScheduleTable;