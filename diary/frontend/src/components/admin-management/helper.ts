import * as XLSX from 'xlsx';
import {IGroups, IStudent, ISubject, ITeacher} from "@/redux/types.ts";

export type TExportStudentsOrTeachersToExcel = {
    arrayItems: IStudent[] | ITeacher[] | IGroups[] | ISubject[];
    label: string;
}

export const exportStudentsOrTeachersToExcel = ({arrayItems, label}: TExportStudentsOrTeachersToExcel) => {
    const worksheet = XLSX.utils.json_to_sheet(arrayItems);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, label);

    XLSX.writeFile(workbook, `${label}.xlsx`);
}