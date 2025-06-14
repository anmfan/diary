import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {IUserData} from "@/redux/types.ts";

export type TDeleteStudent = {
    type: string;
    message: string;
    deletedId: string;
    oldGroup: string;
    students_count: number;
}

export type TAddStudentToGroup = {
    fullName: string;
    email: string;
    group_name: string;
    role_id: number;
    excelImportFile: FileList | null;
} | FormData


export type TAddStudentToGroupResponse = {
    message: string;
    results: TResultAddStudents[]
}

export type TResultAddStudents = {
    status: string;
    tokens: string[];
    user: IUserData<string | null>
}

export type TGetSubjectsResponse = {
    groupId: number;
    subject: {
        id: number;
        name: string;
    } | null;
    teacher: {
        id: number;
        user: {
            first_name: string;
            last_name: string;
            email: string;
        }
    } | null;
}[]

export type TGetGroupsAndSubjectsByTeacher = {
    groupId: number;
    groupName: string;
    subjects: {
        subjectId: number;
        subjectName: string;
    }[];
    students: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    }[];
};

export type RTKQueryError = FetchBaseQueryError & {
    error?:{
        data?: {
            message?: string
        }
    }
}

type TScheduleMap = {
    teacher: {
        user_id: number;
        user: {
            first_name: string;
            last_name: string;
        };
    };
    student: {
        group: {
            name: string
        };
    };
}

export type TScheduleGroups<K extends keyof TScheduleMap> = {
    id: number;
    date: string;
    lesson_number: number;
    classroom: string;
    groupId: number;
    subjectId: number;
    teacherId: number;
    subject: {
        name: string;
    };
} & {
    [P in K]: TScheduleMap[P];
}

export type TGetSubjectsData = {
    groupId: number | null;
    weekOffset?: number;
}

export type TScheduleDeleteResponse = {
    message: string;
    lesson: {
        selectedSubjectId: number;
        selectedDay: string;
    }
}

export type TScheduleEditResponse = {
    message: string;
    lesson: Omit<TScheduleGroups<"teacher">, "subject" | "teacher">
}

export type TGetMarksByStudentResponse = {
    studentId: number;
    studentName: string;
    subjectId: number;
    subjectName: string;
    marks: {
        value: string;
        date: string;
    }[];
};

export type TGetMarksByTeacherResponse = {
    groupId: number;
    groupName: string;
    students: {
        studentId: number;
        studentName: string;
        subjects: Subject[];
    }[];
};

export type TAddMark = {
    studentId: number;
    subjectId: number;
    date: string;
    mark: string;
    groupName: string;
}

export type TAddMarkResponse = {
    studentId: number;
    subjectId: number;
    date: string;
    mark: number;
}

export type Subject = {
    subjectId: number;
    subjectName: string;
    marks: Array<{
        value: number;
        date: string;
    }>;
};

export type TGetStudentInfoAccount = {
    groupName: string;
    attendance: {
        totalLessons: number;
        absences: number;
        attendancePercentage: number;
    };
    averageMark: number;
}

export type TGetTeacherInfoAccount = {
    curatedGroups: {
        id: number;
        name: string;
        course: string;
        students_count: number;
    }[];
    subjects: {
        id: number;
        name: string;
        classroom: string;
    }[];
    groupsTeachingSubjects: {
        group: {
            id: number;
            name: string;
            course: string;
            students_count: number;
        };
        subject: {
            id: number;
            name: string;
        }
    }[];
}

export type TGetAdminAccountInfo = {
    groupsCount: number;
    teachersCount: number;
    studentsCount: number;
    subjectsCount: number;
}

export type TGetAdminDashboard = {
    recentStudents: {
        id: number;
        user_id: number;
        group_id: number;
        user: {
            email: string;
            first_name: string;
            last_name: string;
        };
        group: {
            name: string;
        };
    }[];
    recentTeachers: {
        id: number;
        user_id: number;
        user: {
            email: string;
            first_name: string;
            last_name: string;
        };
    }[];
}

export type TGetTeacherDashboard = {
    upcomingClasses: {
        id: number;
        date: string;
        lesson_number: number;
        classroom: string;
        groupId: number;
        subjectId: number;
        teacherId: number;
        subject: {
            name: string;
        };
        group: {
            name: string;
        };
    }[];
}

export type TGetStudentDashboard = {
    upcomingClasses: {
        id: number;
        date: string;
        lesson_number: number;
        classroom: string;
        groupId: number;
        subjectId: number;
        teacherId: number;
        subject: {
            name: string;
        };
    }[];
    recentMarks: {
        mark: string;
        date: string;
        studentId: number;
        subjectId: number;
        subject: {
            name: string;
        }
    }[];
}

export type TCreatedScheduleGroups = {
    message: string;
    count: number;
    createdSchedules: TScheduleGroups<"teacher">[];
    details: string;
}

export type TUpdateAvatar = {
    success: boolean;
    avatar: string;
    message: string;
}

export type TGetGroupSubjects = {
    subjectId: number;
    subjectName: string;
}

export type TArgsEntry = {
    endpointName?: string;
    originalArgs?: { groupId?: number; weekOffset?: number };
}

export type TDeleteStudentId = { user_id: number }
export type TGetGroupDataByCuratorEmail = { email: string }