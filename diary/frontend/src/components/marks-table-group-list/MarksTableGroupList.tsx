import styles from "@/pages/marks-page/styles.module.css";
import {Subject} from "@/redux/api/types.ts";
import { motion } from "motion/react";
import {gradeVariants, rowVariants} from "@/pages/marks-page/helpers.ts";

type MarksTableGroupListProps = {
    studentId: number;
    studentName: string;
    subjects: Subject[];
    selectedSubject: number | null;
    dates: string[];
    index: number;
    activePopup: {
        studentId: number;
        date: string;
        studentName: string;
        value: string;
    } | null;
    onStartEditing: (studentId: number, date: string, studentName: string) => void;
};

const MarksTableGroupList = ({
         studentId,
         studentName,
         subjects,
         selectedSubject,
         dates,
         index,
         activePopup,
         onStartEditing
    }: MarksTableGroupListProps) => {
    const currentSubject = subjects.find(s => s.subjectId === selectedSubject);
    const marksByDate = new Map<string, number[]>();

    currentSubject?.marks?.forEach(mark => {
        if (!marksByDate.has(mark.date)) {
            marksByDate.set(mark.date, []);
        }
        marksByDate.get(mark.date)?.push(mark.value);
    });

    return (
        <motion.tr
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            className={styles.gradeRow}
        >
            <td className={styles.studentCell}>
                {studentName}
            </td>
            {dates.map(date => {
                const marks = marksByDate.get(date) || [];

                return (
                    <td
                        key={`${studentId}-${date}`}
                        className={`${styles.gradeCell} ${marks.length === 0 ? styles.emptyCell : ''}`}
                        onClick={() => {
                            if (activePopup) return;
                            if (marks.length >= 2) return;
                            onStartEditing(studentId, date, studentName);
                        }}
                    >
                        <div className={styles.gradesContainer}>
                            {marks.map((value, idx) => (
                                <motion.span
                                    key={`${date}-${idx}`}
                                    className={styles.gradeCell}
                                    data-grade={value}
                                    variants={gradeVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    custom={idx}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    {value}
                                </motion.span>
                            ))}
                        </div>
                    </td>
                );
            })}
        </motion.tr>
    );
};

export default MarksTableGroupList;