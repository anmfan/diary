import {
    IGroups, IGroupsInitialState,
    IStudent, IStudentsInitialState,
    ISubject,
    ITeacher, ITeachersInitialState, IUserData, IUserReturnedGroupData, TDeleteItemResponse,
    TEditResponse,
    TEntityEditResponse,
    TGroupEdit,
    TSubjectEdit
} from "@/redux/types.ts";
import {SortingOptionsValues} from "@/components/sorting-options-students/const.ts";
import {SortingOptionsGroupsValues} from "@/components/sorting-options-groups/const.ts";
import {SortingOptionsTeachersValues} from "@/components/sorting-options-teachers/const.ts";

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

const updateGroup = (items: IGroups[], data: IUserData<IUserReturnedGroupData | null>) => {
    return items.map(group => {
        if (group.name === data.group?.name) {
            return {
                ...group,
                curator: {
                    user_id: String(data.id),
                    user: {
                        first_name: data.firstName,
                        last_name: data.lastName,
                        email: data.email,
                    }
                }
            }
        }
        return group
    })
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

const filterBySorterOptionsGroups =
    (
        state: IGroupsInitialState,
        payload: string
    ) => {
        state.selectedGroupByCurator = payload;

        if (payload === SortingOptionsGroupsValues.All) {
            state.sortedItems = state.items
        } else if (payload === SortingOptionsGroupsValues.WithoutCurator) {
            state.sortedItems = state.items.filter(group => !group.curator)
        } else if (payload === SortingOptionsGroupsValues.WithStudents) {
            state.sortedItems = state.items.filter(group => group.students_count > 0)
        } else {
            state.sortedItems = state.items.filter(group => group.curator)
        }
    }

const filterBySorterOptionsTeachers =
    (
        state: ITeachersInitialState,
        payload: string
    ) => {
        state.selectedTeachersByGroup = payload;

        if (payload === SortingOptionsTeachersValues.All) {
            state.sortedItems = state.items
        } else if (payload === SortingOptionsTeachersValues.WithoutGroups) {
            state.sortedItems = state.items.filter(teacher => teacher.curated_groups?.length === 0)
        } else {
            state.sortedItems = state.items.filter(teacher => teacher.curated_groups!.length > 0)
        }
    }

const updateStudentsCountInGroup = (items: IGroups[], data: TDeleteItemResponse) => {
    return items = items.map((group) => {
        if (group.name === data.groupName) {
            return {
                ...group,
                students_count: data.groupStudentCount,
                students: group.students.filter(student => student.user_id !== data.userId)
            }
        }
        return group
    })
}

export {
    updateFilteredList,
    updateEditedUser,
    updateEditedEntity,
    updateForUnpinStudentFromGroup,
    filterBySorterOptionsStudents,
    updateStudentsCountInGroup,
    filterBySorterOptionsGroups,
    filterBySorterOptionsTeachers,
    updateGroup
}