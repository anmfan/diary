import * as XLSX from 'xlsx';
import {IGroups, IStudent, ISubject, ITeacher} from "@/redux/types.ts";
import {toast} from "react-toastify";

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