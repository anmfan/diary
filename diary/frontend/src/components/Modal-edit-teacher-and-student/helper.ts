import {TSelectedItem} from "@/components/admin-management/types.ts";
import {IStudent, ITeacher} from "@/redux/types.ts";

export const isUser = (item: TSelectedItem): item is ITeacher => {
    return "first_name" in item!;
}

export const isStudent = (item: TSelectedItem): item is IStudent => {
    return item?.tab === 'students' && item.group !== null;
}

export const isTeacher = (item: TSelectedItem): item is ITeacher => {
    return item?.tab === 'teachers';
}

export const mappingGroups = (item: TSelectedItem) => {
    if (isStudent(item)) return item.group;
    if (isTeacher(item)) return item.curated_groups.map(group => group.name).join(', ') || 'Нет группы';
    return 'Нет группы';
}