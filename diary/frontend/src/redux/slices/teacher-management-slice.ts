import { createSlice } from "@reduxjs/toolkit";
import { initialStateTeacherManagement } from "@/redux/types.ts";

const initialState: initialStateTeacherManagement = {
    items: []
}

const teacherManagementSlice = createSlice({
    name: 'teacher-management',
    initialState,
    reducers: {},
})

const teacherManagementSliceActions = teacherManagementSlice.actions;
export {teacherManagementSlice, teacherManagementSliceActions}