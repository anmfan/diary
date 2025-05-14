import {
    modalAddTeacherStudent,
    TModalTeacherStudentChoose
} from "@/components/modal-add-teacher-student-choose/const.ts";
import ModalAddTeacherAndStudent from "@/components/modal-add-teacher/ModalAddTeacherAndStudent.tsx";

const ModalAddTeacherStudentChoose = ({ typeTab }: TModalTeacherStudentChoose) => {
    return typeTab === 'teachers' ? (
        <ModalAddTeacherAndStudent {...modalAddTeacherStudent.teacher} />
    ) : (
        <ModalAddTeacherAndStudent {...modalAddTeacherStudent.student} />
    );
};

export default ModalAddTeacherStudentChoose;