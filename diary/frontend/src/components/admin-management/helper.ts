import * as XLSX from 'xlsx';
import {IGroups, IStudent, ISubject, ITeacher, TGroupStudents} from "@/redux/types.ts";
import {toast} from "react-toastify";
import {Nullable} from "@/const.ts";

export type TExportStudentsOrTeachersToExcel = {
    arrayItems: Nullable<IStudent[] | ITeacher[] | ISubject[] | IGroups[]>;
    label: string;
}

export const exportToExcel = ({arrayItems, label}: TExportStudentsOrTeachersToExcel) => {
    if (arrayItems === null) return toast.error("Список пуст")

    const worksheet = XLSX.utils.json_to_sheet(arrayItems);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, label);

    XLSX.writeFile(workbook, `${label}.xlsx`);
}

export const exportGroupStudentsToExcel = (students: TGroupStudents[] | null, groupName: string) => {
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