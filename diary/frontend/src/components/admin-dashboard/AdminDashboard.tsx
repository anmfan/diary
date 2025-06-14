import {TEmailProp} from "@/pages/home-page/types.ts";
import {useGetAdminDashboardQuery} from "@/redux/api/user-api.ts";
import Spinner from "@/components/spinner/Spinner.tsx";
import styles from "@/pages/home-page/home.module.css";
import {cardVariants, fadeInUp, staggerContainer} from "@/pages/home-page/animations.ts";
import { motion } from "motion/react";

const AdminDashboard = ({ email }: TEmailProp) => {
    const { data, isLoading } = useGetAdminDashboardQuery({ email });

    const getUserInitials = (firstName: string, lastName: string) => {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    };

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
                    <h2 className={styles.sectionTitle}>Новые студенты</h2>
                </div>

                {data?.recentStudents?.length ? (
                    data.recentStudents.map((student, index) => (
                        <motion.div
                            key={student.id}
                            initial="offscreen"
                            whileInView="onscreen"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={cardVariants}
                            transition={{ delay: index * 0.1 }}
                            className={styles.userCard}
                        >
                            <div className={styles.userAvatar}>
                                {getUserInitials(student.user.first_name, student.user.last_name)}
                            </div>
                            <div className={styles.userInfo}>
                                <div className={styles.userName}>
                                    {student.user.first_name} {student.user.last_name}
                                </div>
                                <div className={styles.userEmail}>{student.user.email}</div>
                                <div className={styles.cardSubtitle}>
                                    Группа: {student.group?.name || 'Не назначена'}
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <motion.div
                        variants={fadeInUp}
                        className={styles.emptyMessage}
                    >
                        Нет новых студентов
                    </motion.div>
                )}
            </motion.div>

            <motion.div
                variants={staggerContainer}
                className={styles.section}
            >
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Новые преподаватели</h2>
                </div>

                {data?.recentTeachers?.length ? (
                    data.recentTeachers.map((teacher, index) => (
                        <motion.div
                            key={teacher.id}
                            initial="offscreen"
                            whileInView="onscreen"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={cardVariants}
                            transition={{ delay: index * 0.1 }}
                            className={styles.userCard}
                        >
                            <div className={styles.userAvatar}>
                                {getUserInitials(teacher.user.first_name, teacher.user.last_name)}
                            </div>
                            <div className={styles.userInfo}>
                                <div className={styles.userName}>
                                    {teacher.user.first_name} {teacher.user.last_name}
                                </div>
                                <div className={styles.userEmail}>{teacher.user.email}</div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className={styles.emptyMessage}>Нет новых преподавателей</div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default AdminDashboard;