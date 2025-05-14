import ModalEditTeacherAndStudent from "@/components/Modal-edit-teacher-and-student/ModalEditTeacherAndStudent.tsx";
import ModalEditGroupAndSubject from "@/components/Modal-edit-group-and-subject/ModalEditGroupAndSubject.tsx";
import {modalEditGroupSubject} from "@/components/modal-edit-teacher-student-choose/const.ts";

const ModalEditChoose = ({ typeTab }: {typeTab: 'user' | 'group' | 'subject'}) => {
    return typeTab === 'user'
        ? <ModalEditTeacherAndStudent />
        : typeTab === 'group'
            ? <ModalEditGroupAndSubject {...modalEditGroupSubject.group} />
            : <ModalEditGroupAndSubject {...modalEditGroupSubject.subject} />;
};

export default ModalEditChoose;