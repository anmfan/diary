import {IGroups, IStudent, ISubject, ITeacher} from "@/redux/types.ts";

export const TabsOptions = {
    teachers: "teachers",
    students: "students",
    groups: "groups",
    subjects: "subjects"
} as const

export type TTabsOptions = typeof TabsOptions[keyof typeof TabsOptions];

export const tabs = [
    { key: TabsOptions.teachers, label: "Преподаватели" },
    { key: TabsOptions.students, label: "Студенты" },
    { key: TabsOptions.groups, label: "Группы" },
    { key: TabsOptions.subjects, label: "Предметы" },
];

export type TSelectedItem =
    | (ITeacher & { tab: 'teachers' })
    | (IStudent & { tab: 'students' })
    | (IGroups & { tab: 'groups' })
    | (ISubject & { tab: 'subjects' })
    | null;
