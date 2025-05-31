import {RootState} from "../types.ts";


export const allTeachers = (state: Pick<RootState, 'teachers'>) => state.teachers.items;
export const sortedTeacherByGroup = (state: Pick<RootState, 'teachers'>) => state.teachers.sortedItems;
export const selectedTeachersByGroup = (state: Pick<RootState, 'teachers'>) => state.teachers.selectedTeachersByGroup;

export const teacherWithoutSubject = (subjectId: number) => (state: Pick<RootState, 'teachers' | 'subjects'>) => {
    const subject = state.subjects.items.find(subject => subject.id === subjectId)
    const availableTeachers = subject?.teachers.map(teacher => teacher.user.id);
    return state.teachers.items.filter(teacher => !availableTeachers?.includes(teacher.id))
}