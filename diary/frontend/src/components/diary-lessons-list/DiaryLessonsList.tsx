import styles from "./styles.module.css";
import {getLessonCountText} from "@/pages/diary-page/helper.ts";
import {motion} from "motion/react";
import {useEffect, useState} from "react";
import Spinner from "@/components/spinner/Spinner.tsx";

type TDiaryLessonsList = {
    displayData: {
        date: string
        day: string
        lessons: any[]
        formattedDate: string
    }[];
}

const DiaryLessonsList = ({ displayData }: TDiaryLessonsList) => {
    const [activeIndex, setActiveIndex] = useState(0);
    
    useEffect(() => {
        if (displayData.length === 0) return;

        const todayIndex = displayData.findIndex(
            (entry) => new Date(entry.date).toDateString() === new Date().toDateString()
        );

        setActiveIndex(todayIndex !== -1 ? todayIndex : 0);
    }, [displayData]);

    if (!displayData || displayData.length === 0 || !displayData[activeIndex]) {
        return <Spinner />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.daysSidebar}>
                {displayData.map((entry, index) => (
                    <motion.div
                        key={entry.date}
                        className={`${styles.dayCard} ${activeIndex === index ? styles.active : ""}`}
                        onClick={() => setActiveIndex(index)}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        style={{ cursor: "pointer" }}
                    >
                        <div className={styles.dayName}>{entry.day}</div>
                        <div className={styles.date}>{entry.formattedDate}</div>
                        <div className={styles.lessonCount}>
                            {entry.lessons.length} {getLessonCountText(entry.lessons.length)}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className={styles.scheduleCenter}>
                <motion.div
                    key={displayData[activeIndex].date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={styles.scheduleCard}
                >
                    <h2>{displayData[activeIndex].day}, {displayData[activeIndex].formattedDate}</h2>
                    <ul>
                        {activeIndex === 5 || activeIndex === 6 && (<li>Сегодня выходной</li>)}
                        {displayData[activeIndex].lessons.length === 0 && (<li>Занятий нет</li>)}
                        {displayData[activeIndex].lessons.length > 0 && (
                            displayData[activeIndex].lessons.map((lesson, i) => (
                                <motion.li
                                    key={`${lesson.date}-${i}`}
                                    className={styles.homeworkItem}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                >
                                    <div className={styles.subjectIcon}>
                                        <span>{i + 1}</span>
                                    </div>
                                    <div className={styles.taskInfo}>
                                        <div className={styles.subjectName}>
                                            {lesson.subject.name}
                                        </div>
                                        <div className={styles.task}>
                                            Кабинет: {lesson.classroom}
                                        </div>
                                        {"group" in lesson && (
                                            <div className={styles.task}>
                                                Группа: {lesson.group.name}
                                            </div>
                                        )}
                                    </div>
                                </motion.li>
                                    ))
                                )}
                    </ul>
                </motion.div>
            </div>
        </div>
    );
};

export default DiaryLessonsList;