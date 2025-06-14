import styles from "@/pages/marks-page/styles.module.css";
import {useEffect, useState} from "react";
import Spinner from "@/components/spinner/Spinner.tsx";
import TeacherNoGroups from "@/components/teacher-no-groups/TeacherNoGroups.tsx";
import { useGetGroupsAndSubjectByTeacherQuery } from "@/redux/api/teacher-management-api.ts";
import {useAppSelector} from "@/hooks/store.ts";
import {userFIO} from "@/redux/selectors/user-selector.ts";
import MarksSelectors from "@/components/marks-selectors/MarksSelectors.tsx";
import {useAddMarkMutation, useGetMarksByTeacherQuery, useGetSchedulesByGroupQuery} from "@/redux/api/schedule-api.ts";
import MarksTableGroupList from "@/components/marks-table-group-list/MarksTableGroupList.tsx";
import {compareDates} from "@/pages/diary-page/helper.ts";
import { motion } from "motion/react";
import {toast} from "react-toastify";
import {formatDateShort} from "@/components/marks-table/helpers.ts";

type ActivePopup = {
    studentId: number;
    date: string;
    studentName: string;
    value: string;
} | null;

const MarksTable = () => {
    const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<string>("");
    const [lessonDates, setLessonDates] = useState<string[]>([]);
    const [activePopup, setActivePopup] = useState<ActivePopup>(null);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [addMark] = useAddMarkMutation();

    const { email } = useAppSelector(userFIO);

    const { data: groupsData, isLoading } = useGetGroupsAndSubjectByTeacherQuery(
        { teacherEmail: email! },
        { skip: !email });

    const { data: marksData, isLoading: marksIsLoading } = useGetMarksByTeacherQuery(
        { email, groupName: selectedGroup },
        { skip: !email || !selectedGroup });

    const currentGroup = groupsData?.find(group => group.groupName === selectedGroup);
    const currentSubjectsByGroup = currentGroup?.subjects;

    const groupId = currentGroup ? currentGroup.groupId : null;
    const { data: scheduleData, isLoading: scheduleIsLoading } = useGetSchedulesByGroupQuery(
        { groupId },
        { skip: !groupId }
    )

    useEffect(() => {
        if (groupsData && groupsData.length > 0 && !selectedGroup) {
            setSelectedGroup(groupsData[0].groupName);
        }

        if (currentSubjectsByGroup && currentSubjectsByGroup.length > 0 && selectedSubject === null) {
            setSelectedSubject(currentSubjectsByGroup[0].subjectId);
        }
    }, [currentSubjectsByGroup, groupsData, selectedGroup, selectedSubject]);

    useEffect(() => {
        if (!scheduleData || selectedSubject === null) {
            setLessonDates([]);
            return;
        }

        const hasSubjectInSchedule = scheduleData.some(
            lesson => lesson.subjectId === selectedSubject
        );

        if (!hasSubjectInSchedule) {
            setLessonDates([]);
            return;
        }

        const subjectLessons = scheduleData.filter(
            lesson => lesson.subjectId === selectedSubject
        );

        const uniqueDates = Array.from(
            new Set(subjectLessons.map(lesson => lesson.date))
        );

        const sortedDates = uniqueDates.sort(compareDates);
        setLessonDates(sortedDates);
    }, [scheduleData, selectedSubject]);

    const handleGroupChange = (groupName: string) => {
        setSelectedGroup(groupName);
        setSelectedSubject(null);
    };

    const handleStartEditing = (studentId: number, date: string, studentName: string) => {
        if (!selectedSubject) {
            setError('Сначала выберите предмет');
            return;
        }

        if (activePopup) {
            setActivePopup(null);
        }

        setActivePopup({
            studentId,
            date,
            studentName,
            value: ''
        });
        setError('');
    };

    const handleInputChange = (value: string) => {
        if (!activePopup) return;

        const normalizedValue = value.toLowerCase() === 'н' ? 'н' : value;

        if (normalizedValue === '' || /^[1-5н]$/.test(normalizedValue)) {
            setActivePopup({
                ...activePopup,
                value: normalizedValue
            });
        }
    };

    const handleSaveMark = async () => {
        if (!activePopup || !activePopup.value) {
            setError('Введите оценку (1-5) или "н" для отсутствия');
            return;
        }

        setIsSaving(true);
        try {
            await addMark({
                studentId: activePopup.studentId,
                subjectId: selectedSubject!,
                date: activePopup.date,
                groupName: selectedGroup,
                mark: activePopup.value
            }).unwrap();

            setActivePopup(null);
            setError('');
        } catch (err) {
            console.error('Ошибка при добавлении оценки:', err);
            setError('Не удалось добавить оценку');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEditing = () => {
        setActivePopup(null);
        setError('');
    };

    if (groupsData?.length === 0) return <TeacherNoGroups />;
    if (isLoading || marksIsLoading || scheduleIsLoading) return <Spinner />;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={styles.table}
        >
            <h1 className={styles.title}>Журнал оценок</h1>
            <div className={styles.table}>
                <MarksSelectors
                    groupData={groupsData}
                    selectedGroup={selectedGroup}
                    selectedSubject={selectedSubject}
                    setSelectedGroup={handleGroupChange}
                    setSelectedSubject={setSelectedSubject}
                    currentSubjectsByGroup={currentSubjectsByGroup}
                />

                <div className={styles.tableContainer}>
                    <table className={styles.gradeTable}>
                        <thead>
                        <tr>
                            <th className={styles.studentHeader}>Студент</th>
                            {lessonDates.map(date => (
                                <th key={date} className={styles.dateHeader}>
                                    {formatDateShort(date)}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {!currentGroup || currentGroup.students.length === 0 ? (
                            <tr className={styles.noStudentsMessage}>
                                <td colSpan={lessonDates.length + 1} style={{ padding: "20px", textAlign: "center" }}>
                                    В группе нет студентов
                                </td>
                            </tr>
                        ) : (
                            currentGroup.students.map((student, index) => (
                                <MarksTableGroupList
                                    key={student.id}
                                    studentId={student.id}
                                    studentName={`${student.last_name} ${student.first_name}`}
                                    subjects={marksData?.students.find(s => s.studentId === student.id)?.subjects || []}
                                    selectedSubject={selectedSubject}
                                    dates={lessonDates}
                                    index={index}
                                    activePopup={activePopup}
                                    onStartEditing={handleStartEditing}
                                />
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {activePopup && (
                <div className={styles.popupOverlay}>
                    <motion.div
                        className={styles.markPopup}
                        initial={{ scale: 0.8, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <div className={styles.popupHeader}>
                            <span>Добавить оценку</span>
                            <button
                                className={styles.closeButton}
                                onClick={handleCancelEditing}
                                disabled={isSaving}
                            >
                                &times;
                            </button>
                        </div>

                        <div className={styles.popupContent}>
                            <input
                                type="text"
                                value={activePopup.value}
                                onChange={(e) => handleInputChange(e.target.value)}
                                className={styles.markInput}
                                maxLength={1}
                                inputMode="numeric"
                                disabled={isSaving}
                                autoFocus
                            />

                            <motion.button
                                className={styles.saveButton}
                                onClick={handleSaveMark}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={isSaving || !activePopup.value}
                            >
                                {isSaving ? (
                                    <div className={styles.spinner}></div>
                                ) : (
                                    "Добавить"
                                )}
                            </motion.button>
                        </div>

                        {error && (
                            <div className={styles.popupError}>
                                {toast.error(error)}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default MarksTable;