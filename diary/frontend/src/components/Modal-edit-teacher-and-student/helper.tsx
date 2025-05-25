import {TSelectedItem} from "@/components/admin-management/types.ts";
import {IStudent, ITeacher} from "@/redux/types.ts";
import ModalEditAddGroup from "@/components/modal-edit-add-group/ModalEditAddGroup.tsx";

export const isUser = (item: TSelectedItem): item is ITeacher => {
    return "first_name" in item!;
}

export const isStudent = (item: TSelectedItem): item is IStudent => {
    return item?.tab === 'students';
}

export const isTeacher = (item: TSelectedItem): item is ITeacher => {
    return item?.tab === 'teachers';
}

export const mappingGroups = (item: TSelectedItem) => {
    if (isStudent(item)) return item.group ? item.group : <ModalEditAddGroup item={item}/>
    if (isTeacher(item)) {
        return item.curated_groups?.map(group => group.name).join(', ')
            || <ModalEditAddGroup item={item}/>;
    }
    return "Нет группы"
}