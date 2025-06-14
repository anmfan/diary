import MainContainer from "@/components/main-container/MainContainer.tsx";
import HomeMeeting from "@/components/home-meeting/HomeMeeting.tsx";
import {useAppSelector} from "@/hooks/store.ts";
import {userFIO} from "@/redux/selectors/user-selector.ts";
import {UsersRoles} from "@/redux/slices/user-slice.ts";
import TeachersDashboard from "@/components/teachers-dashboard/TeachersDashboard.tsx";
import StudentsDashboard from "@/components/students-dashboard/StudentsDashboard.tsx";
import AdminDashboard from "@/components/admin-dashboard/AdminDashboard.tsx";

const Home = () => {
    const { role, email } = useAppSelector(userFIO);

    const dashboardRendering = () => {
        switch (role) {
            case UsersRoles.teacher: return <TeachersDashboard email={email}/>
            case UsersRoles.student: return <StudentsDashboard email={email}/>
            case UsersRoles.admin: return <AdminDashboard email={email}/>
        }
    }

    return (
        <MainContainer>
            <HomeMeeting/>
            {dashboardRendering()}
        </MainContainer>
    );
};

export default Home;