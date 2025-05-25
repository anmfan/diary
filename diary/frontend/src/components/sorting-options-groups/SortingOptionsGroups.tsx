import {useAppDispatch, useAppSelector} from "@/hooks/store.ts";
import useSetSelectedItem from "@/hooks/useSetSelectedItem.ts";
import {ChangeEvent} from "react";
import styles from "@/components/sorting-options-students/styles.module.css";
import {SortingOptionsGroupsValues} from "@/components/sorting-options-groups/const.ts";
import {groupsActions} from "@/redux/slices/groups-slice.ts";
import {selectedGroupsByCurator} from "@/redux/selectors/groups-selector.ts";

const SortingOptionsGroups = () => {
    const dispatch = useAppDispatch();
    const selectedSortedOption = useAppSelector(selectedGroupsByCurator)
    const { setSelected } = useSetSelectedItem();

    const onChangeSortingOption = (event: ChangeEvent<HTMLSelectElement>) => {
        dispatch(groupsActions.sortingGroupsByCurator(event.target.value));
        setSelected(null);
    }

    return (
        <div className={styles.selectWrapper}>
            <select value={selectedSortedOption} onChange={onChangeSortingOption} className={styles.select}>
                {Object.entries(SortingOptionsGroupsValues).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                ))}
            </select>
        </div>
    );
};

export default SortingOptionsGroups;