import * as XLSX from 'xlsx';
import {IGroups, IStudent, ISubject, ITeacher} from "@/redux/types.ts";
import {toast} from "react-toastify";

type TExportStudents = {
    user_id: number
    user: {
        first_name: string
        last_name: string
        email: string
    }
};

export type TExportStudentsOrTeachersToExcel = {
    arrayItems: IStudent[] | ITeacher[] | IGroups[] | ISubject[] | null;
    label: string;
}

export const exportToExcel = ({arrayItems, label}: TExportStudentsOrTeachersToExcel) => {
    if (arrayItems === null) return toast.error("Список пуст")

    const worksheet = XLSX.utils.json_to_sheet(arrayItems);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, label);

    XLSX.writeFile(workbook, `${label}.xlsx`);
}

export const exportGroupStudentsToExcel = (students: TExportStudents[] | null, groupName: string) => {
    if (!students || students.length === 0) {
        return toast.error("Список студентов пуст");
    }

    const exportData = students.map((student, index) => ({
        '№': index + 1,
        'Имя, Отчество': student.user.last_name,
        'Фамилия': student.user.first_name,
        'ID': student.user_id
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Группа ${groupName}`);

    XLSX.writeFile(workbook, `Студенты группы ${groupName}.xlsx`);
}