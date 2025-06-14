import {TabsOptions, TSelectedItem} from "@/components/admin-management/types.ts";
import {IStudent, ITeacher} from "@/redux/types.ts";
import ModalEditRemoveGroup from "@/components/modal-edit-remove-group/ModalEditRemoveGroup.tsx";

export const isUser = (item: TSelectedItem) => {
    return item?.tab === TabsOptions.teachers || item?.tab === TabsOptions.students;
}

export const isStudent = (item: TSelectedItem): item is IStudent => {
    return item?.tab === TabsOptions.students;
}

export const isTeacher = (item: TSelectedItem): item is ITeacher => {
    return item?.tab === TabsOptions.teachers;
}

export const mappingGroups = (item: TSelectedItem) => {
    if (isStudent(item)) {
        const group = item.group
        return group ? <ModalEditRemoveGroup item={item} groups={group.split(", ")}/> : "Нет группы";
    }
    if (isTeacher(item)) {
        const groups = item.curated_groups?.map(group => group.name).join(', ') || null;
        return groups ? <ModalEditRemoveGroup item={item} groups={groups.split(", ")}/> : "Нет группы";
    }
    return "Нет группы"
}