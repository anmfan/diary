import {RootState} from "../types.ts";


export const allTeachers = (state: Pick<RootState, 'teachers'>) => state.teachers.items;
export const teachersStatus = (state: Pick<RootState, 'teachers'>) => state.teachers.teachersIsExist;
