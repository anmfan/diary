import {selectAuthStatus} from "../redux/selectors/user-selector.ts";
import {useAppSelector} from "./store.ts";

const useAuth = () => {
    return useAppSelector(selectAuthStatus);
};

export default useAuth;