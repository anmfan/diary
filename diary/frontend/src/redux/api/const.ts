import {IUserData, TGroupStudents} from "@/redux/types.ts";

export const updateNewStudentsList = (student: IUserData<string | null>, studentArray: TGroupStudents[]) => {
    return studentArray.push({
        format: student.format,
        user_id: student.id,
        user: {
            first_name: student.firstName,
            last_name: student.lastName,
            email: student.email,
        }
    })
}