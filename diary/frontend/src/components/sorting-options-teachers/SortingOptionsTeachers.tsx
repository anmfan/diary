import {useAppDispatch, useAppSelector} from "@/hooks/store.ts";
import useSetSelectedItem from "@/hooks/useSetSelectedItem.ts";
import {ChangeEvent} from "react";
import styles from "@/components/sorting-options-students/styles.module.css";
import {SortingOptionsTeachersValues} from "@/components/sorting-options-teachers/const.ts";
import {teachersActions} from "@/redux/slices/teachers-slice.ts";
import {selectedTeachersByGroup} from "@/redux/selectors/teachers-selector.ts";

const SortingOptionsGroups = () => {
    const dispatch = useAppDispatch();
    const selectedSortedOption = useAppSelector(selectedTeachersByGroup)
    const { setSelected } = useSetSelectedItem();

    const onChangeSortingOption = (event: ChangeEvent<HTMLSelectElement>) => {
        dispatch(teachersActions.sortingTeachersByGroups(event.target.value));
        setSelected(null);
    }

    return (
        <div className={styles.selectWrapper}>
            <select value={selectedSortedOption} onChange={onChangeSortingOption} className={styles.select}>
                <option value={SortingOptionsTeachersValues.All}>{SortingOptionsTeachersValues.All}</option>
                <option value={SortingOptionsTeachersValues.WithGroups}>{SortingOptionsTeachersValues.WithGroups}</option>
                <option value={SortingOptionsTeachersValues.WithoutGroups}>{SortingOptionsTeachersValues.WithoutGroups}</option>
            </select>
        </div>
    );
};

export default SortingOptionsGroups;