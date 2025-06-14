import { useAppDispatch, useAppSelector } from "@/hooks/store.ts";
import { deleteTeacher } from "@/redux/thunks/teachers-thunk.ts";
import { deleteStudent } from "@/redux/thunks/students-thunk.ts";
import { deleteGroup } from "@/redux/thunks/groups-thunk.ts";
import { deleteSubject } from "@/redux/thunks/subjects-thunk.ts";
import { TDeleteItem} from "@/redux/types.ts";
import {TabsOptions, TTabsOptions} from "@/components/admin-management/types.ts";
import { selectSelectedItem } from "@/redux/selectors/user-selector.ts";
import { toast } from "react-toastify";
import { allGroups } from "@/redux/selectors/groups-selector.ts";
import useSetSelectedItem from "@/hooks/useSetSelectedItem.ts";
import { AsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import { MessagesForFailDeleteItem } from "@/hooks/const.ts";

const deleteActions: Record<Exclude<TTabsOptions, "schedule">, AsyncThunk<any, TDeleteItem, { extra: AxiosInstance }>> = {
    teachers: deleteTeacher,
    students: deleteStudent,
    groups: deleteGroup,
    subjects: deleteSubject,
}

const useDeleteItem = () => {
    const dispatch = useAppDispatch();
    const selectedItem = useAppSelector(selectSelectedItem)!;
    const groups = useAppSelector(allGroups);
    const { setSelected } = useSetSelectedItem();

    const deleteItem = () => {
        const teacherHasCuratedGroup = groups.find(group => Number(group.curator?.user_id) === selectedItem.id) || null;

        if (selectedItem.tab === TabsOptions.teachers && teacherHasCuratedGroup) {
            return toast.error(MessagesForFailDeleteItem.failForTeacher)
        }

        if (selectedItem.tab === TabsOptions.groups && selectedItem.students_count > 0) {
            return toast.error(MessagesForFailDeleteItem.failForGroup)
        }

        if (selectedItem.tab === TabsOptions.students && selectedItem.group) {
            return toast.error(MessagesForFailDeleteItem.failForStudent)
        }

        if (selectedItem.tab === TabsOptions.subjects && selectedItem.teachers.length > 0) {
            return toast.error(MessagesForFailDeleteItem.failForSubject)
        }

        const thunk = deleteActions[selectedItem.tab];
        dispatch(thunk({ id: selectedItem.id }));
        setSelected(null);
    };

    return { deleteItem };
};

export default useDeleteItem;