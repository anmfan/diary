import styles from "./styles.module.css";
import Spinner from "@/components/spinner/Spinner.tsx";
import TeacherManagementListStudents
    from "@/components/teacher-management-list-students/TeacherManagementListStudents.tsx";
import { exportGroupStudentsToExcel } from "@/components/admin-management/helper.ts";
import useModal from "@/hooks/useModal.tsx";
import TeacherManagementAddStudent from "@/components/teacher-management-add-student/TeacherManagementAddStudent.tsx";
import AdminManagementModal from "@/components/admin-management-modal/AdminManagementModal.tsx";
import GroupSubjectsList from "@/components/group-subjects-list/GroupSubjectsList.tsx";
import useGetGroupInfo from "@/hooks/useGetGroupInfo.ts";

const TeacherManagement = () => {
    const { openModal, modalIsOpen } = useModal()
    const { groupData, isLoading } = useGetGroupInfo()

    if (isLoading) return <Spinner />

    return (
        <div className={styles.container}>
            <div className={styles.studentsListContent}>
                <h1 className={styles.title}>Управление группой {groupData?.name}</h1>

                <div className={styles.content}>
                    <div className={styles.listContainer}>
                        <div className={styles.listTitle}>
                            <h2>Студенты группы: <span>{groupData?.students_count}</span></h2>
                            <div className={styles.rightTitleBlock}>
                                <svg onClick={() => exportGroupStudentsToExcel(groupData?.students || null, groupData?.name || '')} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                     className={styles.biFiletypeXlsx} viewBox="0 0 16 16">
                                    <path fillRule="evenodd"
                                          d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z"/>
                                    <title>Экспортировать студентов группы</title>
                                </svg>
                                <button
                                    onClick={() => openModal(<TeacherManagementAddStudent />)}
                                    className={styles.managementButton}
                                >
                                    Добавить студента</button>
                            </div>
                        </div>

                        <TeacherManagementListStudents data={groupData}/>
                    </div>
                    <GroupSubjectsList groupId={groupData!.id}/>
                </div>
            </div>
            {modalIsOpen && <AdminManagementModal/>}
        </div>
    );
};

export default TeacherManagement;