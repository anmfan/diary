import {RootState} from "../redux/types.ts";
import {useAppSelector} from "./store.ts";
import {selectSelectedItem} from "../redux/selectors/user-selector.ts";
import {TSelectedItem} from "../components/admin-management/types.ts";

type TSelectorForLists<U> = {
    selectedItem: TSelectedItem;
    list: U;
}

export const useAppSelectorsForLists = <T extends keyof Omit<RootState, 'user'>, U>(storeList: T): TSelectorForLists<U> => {
    const selectedItem = useAppSelector(selectSelectedItem)
    const list = useAppSelector(state => state[storeList].items as U)

    return { selectedItem, list }
}

export default useAppSelectorsForLists;