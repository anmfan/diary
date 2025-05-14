import styles from './management.module.css';
import {useAppSelector} from "@/hooks/store.ts";
import {userRole} from "@/redux/selectors/user-selector.ts";
import {UsersRoles} from "@/redux/slices/user-slice.ts";
import TeacherManagement from "@/components/teacher-management/TeacherManagement.tsx";
import AdminManagement from "@/components/admin-management/AdminManagement.tsx";
import MainContainer from "@/components/main-container/MainContainer.tsx";
import ModalProvider from "@/components/modal-provider/modal-provider.tsx";

const Management = () => {
    const role = useAppSelector(userRole)

    return (
        <MainContainer>
            <div className={styles.container}>
                <ModalProvider>
                    {role === UsersRoles.admin && <AdminManagement/>}
                    {role === UsersRoles.teacher && <TeacherManagement/>}
                </ModalProvider>
            </div>
        </MainContainer>
    );
};

export default Management;