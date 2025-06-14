import {TabsOptions, TSelectedItem} from "@/components/admin-management/types.ts";
import {IGroups, IStudent, ISubject, ITeacher} from "@/redux/types.ts";

export type TAdminManagementDetails<T> = {
    selectedItem: T;
}

export const fioIsExist = (
    firstName: string | null,
    lastName: string | null,
    email: string,
    type: string,
    selectedItem?: TSelectedItem
) => {
    if (type === "group" && "curator" in selectedItem!) {
        const curatorUser = selectedItem.curator;
        return curatorUser && curatorUser.user.first_name
            ? `${curatorUser.user.first_name} ${curatorUser.user.last_name}`
            : email
                ? email
                : "Нет куратора";
    }

    return firstName ? `${firstName} ${lastName}` : "Не указан";
}

export const isTeacher = (item: TSelectedItem): item is ITeacher => {
    return "username" in item!;
}
export const isStudent = (item: TSelectedItem): item is IStudent => {
    return "username" in item!;
}
export const isGroup = (item: TSelectedItem): item is IGroups => {
    return "students_count" in item!;
}
export const isSubject = (item: TSelectedItem): item is ISubject => {
    return "name" in item!;
}

export const checkTabIsGroups = (selectedItem: TSelectedItem) => {
    return TabsOptions.groups === selectedItem?.tab;
}