export type TDeleteStudent = {
    type: string;
    message: string;
    deletedId: string;
    oldGroup: string;
    students_count: number;
}

export type TDeleteStudentId = { user_id: number }
export type TGetGroupDataByCuratorEmail = { email: string }