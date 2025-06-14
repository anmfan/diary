import {formatDate, getLessonTime, TEmailProp} from "@/pages/home-page/types.ts";
import {useGetStudentDashboardQuery} from "@/redux/api/user-api.ts";
import styles from "@/pages/home-page/home.module.css";
import Spinner from "@/components/spinner/Spinner.tsx";
import { motion } from "motion/react";
import {fadeInUp, staggerContainer} from "@/pages/home-page/animations.ts";
import AnimatedDashboardCard from "@/components/animated-dashboard-card/AnimatedDashboardCard.tsx";

const StudentsDashboard = ({ email }: TEmailProp) => {
    const { data, isLoading } = useGetStudentDashboardQuery({ email });

    if (isLoading) return <Spinner />

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className={styles.dashboard}
        >
            <motion.div variants={fadeInUp} className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Ближайшие занятия</h2>
                </div>

                {data?.upcomingClasses?.length ? (
                    data.upcomingClasses.map((cls, index) => (
                        <AnimatedDashboardCard key={cls.id} index={index}>
                            <div className={styles.card}>
                                <div className={styles.cardTitle}>
                                    {formatDate(cls.date)} • {cls.lesson_number} пара ({getLessonTime(cls.lesson_number)})
                                </div>
                                <div className={styles.cardSubtitle}>
                                    {cls.subject.name}
                                </div>
                                <div className={styles.cardSubtitle}>
                                    Ауд. {cls.classroom}
                                </div>
                            </div>
                        </AnimatedDashboardCard>
                    ))
                ) : (
                    <motion.div
                        variants={fadeInUp}
                        className={styles.emptyMessage}
                    >
                        Нет предстоящих занятий
                    </motion.div>
                )}
            </motion.div>

            <motion.div variants={fadeInUp} className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Последние оценки</h2>
                    <a href="/marks" className={styles.viewAll}>Все оценки</a>
                </div>

                {data?.recentMarks?.length ? (
                    data.recentMarks.map((mark, index) => (
                        <AnimatedDashboardCard key={index} index={index}>
                            <div className={styles.card}>
                                <div className={styles.cardTitle}>
                                    <span className={`${styles.markValue} ${mark.mark === 'н' ? styles.absent : ''}`}>
                                      {mark.mark}
                                    </span>
                                    {mark.subject.name}
                                </div>
                                <div className={styles.cardSubtitle}>
                                    {new Date(mark.date).toLocaleDateString('ru-RU')}
                                </div>
                            </div>
                        </AnimatedDashboardCard>
                    ))
                ) : (
                    <motion.div
                        variants={fadeInUp}
                        className={styles.emptyMessage}
                    >
                        Нет оценок
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default StudentsDashboard;