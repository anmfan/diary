import {
    IGroups,
    IStudent,
    ISubject,
    ITeacher,
    TEditResponse,
    TEntityEditResponse,
    TGroupEdit,
    TSubjectEdit
} from "@/redux/types.ts";

const updateFilteredList = <T extends {id: string}>(list: T[], deletedItemId: string): T[] => {
    return list.filter(item => item.id !== deletedItemId)
}

const updateEditedUser = <T extends ITeacher | IStudent>(items: T[], editedData: TEditResponse) => {
    return items.map(item => {
        if (item.id === editedData.user.id) {
            return {
                ...item,
                first_name: editedData.user.first_name,
                last_name: editedData.user.last_name,
                email: editedData.user.email
            };
        }
        return item;
    });
}

const updateEditedEntity = <T extends IGroups | ISubject>(items: T[], editedData: TEntityEditResponse<TGroupEdit | TSubjectEdit>) => {
    return items.map(item => {
        if (item.id === editedData.updated.id) {
            return {
                ...item,
                name: editedData.updated.name,
            };
        }
        return item;
    });
}

const updateForUnpinStudentFromGroup = (item: IGroups, students_count: number, deletedStudentId: string) => {
    return {
        ...item,
        students_count,
        students: item.students.filter(student =>
            student.user_id !== deletedStudentId
        )
    }
}

export { updateFilteredList, updateEditedUser, updateEditedEntity, updateForUnpinStudentFromGroup }