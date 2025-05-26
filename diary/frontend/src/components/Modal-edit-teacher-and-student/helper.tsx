import {TSelectedItem} from "@/components/admin-management/types.ts";
import {IStudent, ITeacher} from "@/redux/types.ts";
import ModalEditAddGroup from "@/components/modal-edit-add-group/ModalEditAddGroup.tsx";
import ModalEditRemoveGroup from "@/components/modal-edit-remove-group/ModalEditRemoveGroup.tsx";

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
    if (isStudent(item)) {
        const group = item.group
        return group ? <ModalEditRemoveGroup item={item} group={group}/> : <ModalEditAddGroup item={item}/>
    }
    if (isTeacher(item)) {
        const groups = item.curated_groups?.map(group => group.name).join(', ')
        return groups && <ModalEditRemoveGroup item={item} groups={groups}/> || <ModalEditAddGroup item={item}/>;
    }
    return "Нет группы"
}