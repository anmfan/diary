import {TSelectedItem} from "@/components/admin-management/types.ts";
import {IStudent, ITeacher} from "@/redux/types.ts";

export const isUser = (item: TSelectedItem): item is ITeacher => {
    return "first_name" in item!;
}

export const isStudent = (item: TSelectedItem): item is IStudent => {
    return item?.tab === 'students' && item.group !== null;
}