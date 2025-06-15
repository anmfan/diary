import {useGetTeacherDashboardQuery} from "@/redux/api/user-api.ts";
import {formatDate, getLessonTime, TEmailProp} from "@/pages/home-page/types.ts";
import styles from "@/pages/home-page/home.module.css";
import Spinner from "@/components/spinner/Spinner.tsx";
import {fadeInUp, staggerContainer} from "@/pages/home-page/animations.ts";
import { motion } from "motion/react";
import AnimatedDashboardCard from "@/components/animated-dashboard-card/AnimatedDashboardCard.tsx";

const TeachersDashboard = ({ email }: TEmailProp) => {
    const { data, isLoading } = useGetTeacherDashboardQuery({ email });

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
                    <h2 className={styles.sectionTitle}>Ваши ближайшие занятия</h2>
                </div>

                {data?.upcomingClasses?.length ? (
                    data.upcomingClasses.slice(0, 5).map((cls, index) => (
                        <AnimatedDashboardCard key={cls.id} index={index}>
                            <div className={styles.card}>
                                <div className={styles.cardTitle}>
                                    {formatDate(cls.date)} • {cls.lesson_number} пара ({getLessonTime(cls.lesson_number)})
                                </div>
                                <div className={styles.cardSubtitle}>
                                    {cls.subject.name} • {cls.group.name}
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
        </motion.div>
    );
};

export default TeachersDashboard;