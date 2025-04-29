import { useAppDispatch } from "./store.ts";
import { useEffect } from "react";
import { check } from "../redux/thunks/user-thunk.ts";

const useAuthCheck = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(check());
        }
    }, [dispatch]);
};

export default useAuthCheck;