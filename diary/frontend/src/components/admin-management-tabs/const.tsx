import ModalAddTeacherStudentChoose
    from "@/components/modal-add-teacher-student-choose/modalAddTeacherStudentChoose.tsx";
import ModalAddGroup from "@/components/modal-add-group/ModalAddGroup.tsx";
import ModalAddSubject from "@/components/modal-add-subject/ModalAddSubject.tsx";
import ModalEditChoose from "@/components/modal-edit-teacher-student-choose/ModalEditChoose.tsx";
import ModalSchedule from "@/components/modal-add-schedule/ModalAddSchedule.tsx";
import ModalEditSchedule from "@/components/modal-edit-schedule/ModalEditSchedule.tsx";


export const ModalAddOptions = {
    teachers: <ModalAddTeacherStudentChoose typeTab="teachers" />,
    students: <ModalAddTeacherStudentChoose typeTab="students" />,
    groups: <ModalAddGroup/>,
    subjects: <ModalAddSubject/>,
    schedule: <ModalSchedule />
}

export const ModalEditOptions = {
    teachers: <ModalEditChoose typeTab="user" />,
    students: <ModalEditChoose typeTab="user" />,
    groups: <ModalEditChoose typeTab="group" />,
    subjects: <ModalEditChoose typeTab="subject" />,
    schedule: <ModalEditSchedule />
}