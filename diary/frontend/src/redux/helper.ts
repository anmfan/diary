import {
    IGroups,
    IStudent, IStudentsInitialState,
    ISubject,
    ITeacher,
    TEditResponse,
    TEntityEditResponse,
    TGroupEdit,
    TSubjectEdit
} from "@/redux/types.ts";
import {SortingOptionsValues} from "@/components/sorting-options-students/const.ts";

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

const filterBySorterOptionsStudents =
    (
        state: IStudentsInitialState,
        payload: string
    ) => {
        state.selectedStudentsByGroup = payload;

    if (payload === SortingOptionsValues.All) {
        state.sortedItems = state.items
    } else if (payload === SortingOptionsValues.WithoutGroup) {
        state.sortedItems = state.items.filter(student => student.group === null)
    } else {
        state.sortedItems = state.items.filter(student => student.group === payload)
    }
}

export {
    updateFilteredList,
    updateEditedUser,
    updateEditedEntity,
    updateForUnpinStudentFromGroup,
    filterBySorterOptionsStudents
}