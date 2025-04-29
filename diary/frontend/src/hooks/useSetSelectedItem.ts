import {TSelectedItem} from "../components/admin-management/types.ts";
import {useAppDispatch} from "./store.ts";
import {userActions} from "../redux/slices/user-slice.ts";

const useSetSelectedItem = () => {
    const dispatch = useAppDispatch();
    const setSelected = (entity: TSelectedItem) =>  {
        dispatch(userActions.setSelectedItem(entity));
    }
    return { setSelected };
};

export default useSetSelectedItem;