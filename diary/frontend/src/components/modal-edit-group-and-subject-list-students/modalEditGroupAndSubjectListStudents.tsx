import styles from "@/components/modal-add-teacher/styles.module.css";
import {useAppDispatch, useAppSelector} from "@/hooks/store.ts";
import {selectStudentsByGroupId} from "@/redux/selectors/groups-selector.ts";
import {removeGroup} from "@/redux/thunks/teachers-thunk.ts";

const ModalEditGroupAndSubjectListStudents = ({selectedItemId}: {selectedItemId: number}) => {
    const dispatch = useAppDispatch();
    const studentsOfSelectedGroup = useAppSelector(selectStudentsByGroupId(selectedItemId))

    const unpinStudentsGroup = (user_id: number) => {
        dispatch(removeGroup({user_id}));
    }

    return (
        studentsOfSelectedGroup.length === 0
            ? (<p style={{margin: '0'}}>Нет студентов</p>)
            : (
                <>
                    {studentsOfSelectedGroup.map(student => (
                        <div key={student.user_id} className={styles.listStudents}>
                            {student.user.first_name} {student.user.last_name}
                            <svg onClick={() => unpinStudentsGroup(student.user_id)} aria-label={"Открепить от группы"} xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="currentColor" className={styles.svgUnpinGroup}
                                 viewBox="0 0 16 16">
                                <path
                                    d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                <title>Открепить от группы</title>
                            </svg>
                        </div>
                    ))}
                </>
            )

    );
};

export default ModalEditGroupAndSubjectListStudents;