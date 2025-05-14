import Routes from '../routes/Routes.tsx';
import useAuthCheck from "@/hooks/useAuthCheck.ts";
import {useEffect} from "react";
import {getAllTeachers} from "@/redux/thunks/teachers-thunk.ts";

const App = () => {
    useAuthCheck();
    useEffect(() => {
        getAllTeachers()
    }, []);
    return (
        <Routes />
    );
};

export default App;