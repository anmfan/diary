import styles from "@/pages/management-page/management.module.css";
import useAppSelectorsForLists from "@/hooks/useAppSelectorsForLists.ts";
import {IGroups} from "@/redux/types.ts";
import {TabsOptions} from "../admin-management/types.ts";
import useSetSelectedItem from "@/hooks/useSetSelectedItem.ts";
import ManagementEmptyList from "../management-empty-list/ManagementEmptyList.tsx";
import {useAppSelector} from "@/hooks/store.ts";
import {sortedGroupsByCurator} from "@/redux/selectors/groups-selector.ts";

const AdminManagementGroups = () => {
    const {selectedItem, list} = useAppSelectorsForLists<"groups", IGroups[]>(TabsOptions.groups)
    const { setSelected } = useSetSelectedItem()
    const sortedGroups = useAppSelector(sortedGroupsByCurator);

    const groupsList = sortedGroups === null ? list : sortedGroups;

    if (groupsList.length === 0) {
        return <ManagementEmptyList tab={"Групп"}/>
    }

    return (
        groupsList.map(group => (
            <div
                key={group.id}
                className={`${styles.listItem} ${selectedItem?.id === group.id ? styles.selected : ''}`}
                onClick={() => setSelected({...group, tab: 'groups'})}
            >
                {group.name}
            </div>
        ))
    );
};

export default AdminManagementGroups;