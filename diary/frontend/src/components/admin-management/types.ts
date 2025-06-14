import {IGroups, IStudent, ISubject, ITeacher} from "@/redux/types.ts";
import {Nullable} from "@/const.ts";

export const TabsOptions = {
    teachers: "teachers",
    students: "students",
    groups: "groups",
    subjects: "subjects",
    schedule: "schedule"
} as const

export type TTabsOptions = typeof TabsOptions[keyof typeof TabsOptions];

export const tabs = [
    { key: TabsOptions.teachers, label: "Преподаватели" },
    { key: TabsOptions.students, label: "Студенты" },
    { key: TabsOptions.groups, label: "Группы" },
    { key: TabsOptions.subjects, label: "Предметы" },
    { key: TabsOptions.schedule, label: "Расписание" },
];

export type TSelectedItem = Nullable<ITeacher | IStudent | IGroups | ISubject>;
