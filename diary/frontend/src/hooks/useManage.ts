import { useAppDispatch, useAppSelector } from "@/hooks/store.ts";
import { deleteTeacher } from "@/redux/thunks/teachers-thunk.ts";
import { deleteStudent } from "@/redux/thunks/students-thunk.ts";
import { deleteGroup } from "@/redux/thunks/groups-thunk.ts";
import { deleteSubject } from "@/redux/thunks/subjects-thunk.ts";
import {TDeleteItem} from "@/redux/types.ts";
import { TTabsOptions } from "@/components/admin-management/types.ts";
import {selectSelectedItem} from "@/redux/selectors/user-selector.ts";
import {toast} from "react-toastify";
import {allGroups} from "@/redux/selectors/groups-selector.ts";
import useSetSelectedItem from "@/hooks/useSetSelectedItem.ts";
import {AsyncThunk} from "@reduxjs/toolkit";
import {AxiosInstance} from "axios";

const deleteActions: Record<TTabsOptions, AsyncThunk<any, TDeleteItem, { extra: AxiosInstance }>> = {
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
        if (selectedItem.tab === "teachers") {
            if (groups.find(group => group.teacher?.user_id === selectedItem.id)) {
                return toast.error("Пока к преподавателю прикреплена группа, его нельзя удалить")
            }
        }
        const thunk = deleteActions[selectedItem.tab];
        dispatch(thunk({ id: selectedItem.id }));
        setSelected(null);
    };

    return { deleteItem };
};

export default useDeleteItem;