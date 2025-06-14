import {useAppDispatch, useAppSelector} from "./store.ts";
import { useEffect } from "react";
import { check } from "../redux/thunks/user-thunk.ts";
import {userFIO} from "@/redux/selectors/user-selector.ts";
import {UsersRoles} from "@/redux/slices/user-slice.ts";
import {getStudentGroup} from "@/redux/thunks/students-thunk.ts";

const useAuthCheck = () => {
    const dispatch = useAppDispatch();
    const { role, email } = useAppSelector(userFIO);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(check());
        }
        if (role === UsersRoles.student && localStorage.getItem('token')) {
            dispatch(getStudentGroup({email}))
        }
    }, [dispatch, email, role]);
};

export default useAuthCheck;