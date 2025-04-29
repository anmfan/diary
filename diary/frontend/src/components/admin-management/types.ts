import {Nullable} from "@/const.ts";
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

export const tabLabels = {
    teacherLabel: "Добавить преподавателя",
    studentLabel: "Добавить студента",
    groupLabel: "Добавить группу",
    subjectLabel: "Добавить предмет",
} as const;

export type TSelectedItem = Nullable<ITeacher | IStudent | IGroups | ISubject>
export type TTabLabels = typeof tabLabels[keyof typeof tabLabels];