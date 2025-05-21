import {groupWithStudents} from "@/redux/selectors/groups-selector.ts";
import {useAppDispatch, useAppSelector} from "@/hooks/store.ts";
import styles from './styles.module.css';
import {studentsActions} from "@/redux/slices/students-slice.ts";
import {ChangeEvent} from "react";
import {SortingOptionsValues} from "@/components/sorting-options-students/const.ts";
import useSetSelectedItem from "@/hooks/useSetSelectedItem.ts";
import {selectedStudentsByGroup} from "@/redux/selectors/students-selector.ts";

const SortingOptionsStudents = () => {
    const sortStudentsCategories = useAppSelector(groupWithStudents);
    const dispatch = useAppDispatch();
    const selectedSortedOption = useAppSelector(selectedStudentsByGroup)
    const { setSelected } = useSetSelectedItem();

    const onChangeSortingOption = (event: ChangeEvent<HTMLSelectElement>) => {
        dispatch(studentsActions.sortingStudentByGroup(event.target.value));
        setSelected(null);
    }

    return (
        <div className={styles.selectWrapper}>
            <select value={selectedSortedOption} onChange={onChangeSortingOption} className={styles.select}>
                <option value={SortingOptionsValues.All}>{SortingOptionsValues.All}</option>
                {sortStudentsCategories.map((groupName) => (
                    <option key={groupName.id} value={groupName.name}>{groupName.name}</option>
                ))}
                <option value={SortingOptionsValues.WithoutGroup}>{SortingOptionsValues.WithoutGroup}</option>
            </select>
        </div>
    );
};

export default SortingOptionsStudents;