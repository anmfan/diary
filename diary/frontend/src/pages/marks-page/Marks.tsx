import MainContainer from "@/components/main-container/MainContainer.tsx";
import styles from './styles.module.css';
import MarksTable from "@/components/marks-table/MarksTable.tsx";
import {useAppSelector} from "@/hooks/store.ts";
import {userFIO} from "@/redux/selectors/user-selector.ts";
import {UsersRoles} from "@/redux/slices/user-slice.ts";
import MarksStudentTable from "@/components/marks-student-table/MarksStudentTable.tsx";

const Marks = () => {
    const user = useAppSelector(userFIO);

    return (
        <MainContainer>
            <div className={styles.container}>
                {user.role === UsersRoles.teacher && <MarksTable />}
                {user.role === UsersRoles.student && <MarksStudentTable user={user}/>}
            </div>
        </MainContainer>
    );
};

export default Marks;