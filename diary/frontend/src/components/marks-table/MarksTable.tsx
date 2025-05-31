import styles from "@/pages/marks-page/styles.module.css";
import {useState} from "react";
import useGetGroupInfo from "@/hooks/useGetGroupInfo.ts";
import Spinner from "@/components/spinner/Spinner.tsx";

const students = [
    { id: 1, name: 'Иванов Иван' },
    { id: 2, name: 'Петрова Анна' },
    { id: 3, name: 'Сидоров Максим' },
    { id: 4, name: 'Кузнецова Елена' },
];

const dates = ['2024-05-01', '2024-05-08', '2024-05-15', '2024-05-22', '2024-05-29'];

const allMarks = [
    { studentId: 1, subjectId: 1, date: '2024-05-01', mark: 5 },
    { studentId: 1, subjectId: 1, date: '2024-05-15', mark: 4 },
    { studentId: 2, subjectId: 1, date: '2024-05-01', mark: 4 },
    { studentId: 3, subjectId: 1, date: '2024-05-22', mark: 3 },
    { studentId: 4, subjectId: 1, date: '2024-05-29', mark: 5 },
    { studentId: 1, subjectId: 2, date: '2024-05-08', mark: 4 },
    // ... другие оценки
];

const MarksTable = () => {
    const [selectedSubject, setSelectedSubject] = useState(1);

    const { subjects, isSubjectsLoading } = useGetGroupInfo()

    if (isSubjectsLoading) return <Spinner />;

    const filteredMarks = allMarks.filter(mark => mark.subjectId === selectedSubject);

    const getMark = (studentId: number, date: string) => {
        const mark = filteredMarks.find(
            m => m.studentId === studentId && m.date === date
        );
        return mark ? mark.mark : '';
    }

    return (
        <div className={styles.table}>
            <div className={styles.controls}>
                <label htmlFor="subject-select" className={styles.label}>
                    Выберите предмет:
                </label>
                <select
                    id="subject-select"
                    value={selectedSubject}
                    onChange={({target}) => setSelectedSubject(Number(target.value))}
                    className={styles.select}
                >
                    {subjects?.map(({subject}) => (
                        <option key={subject.id} value={subject.id}>
                            {subject.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.gradeTable}>
                    <thead>
                    <tr>
                        <th className={styles.studentHeader}>Студент</th>
                        {dates.map(date => (
                            <th key={date} className={styles.dateHeader}>
                                {new Date(date).toLocaleDateString('ru-RU', {
                                    day: 'numeric',
                                    month: 'short'
                                })}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {students.map(student => (
                        <tr key={student.id}>
                            <td className={styles.studentCell}>{student.name}</td>
                            {dates.map(date => (
                                <td key={`${student.id}-${date}`} className={styles.gradeCell}>
                                    {getMark(student.id, date)}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MarksTable;