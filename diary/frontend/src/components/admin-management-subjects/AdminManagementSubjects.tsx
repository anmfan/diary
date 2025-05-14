import styles from "@/pages/management-page/management.module.css";
import useAppSelectorsForLists from "@/hooks/useAppSelectorsForLists.ts";
import {ISubject} from "@/redux/types.ts";
import {TabsOptions} from "../admin-management/types.ts";
import useSetSelectedItem from "@/hooks/useSetSelectedItem.ts";
import ManagementEmptyList from "../management-empty-list/ManagementEmptyList.tsx";

const AdminManagementSubjects = () => {
    const {selectedItem, list} = useAppSelectorsForLists<"subjects", ISubject[]>(TabsOptions.subjects)
    const { setSelected } = useSetSelectedItem()

    if (list.length === 0) {
        return <ManagementEmptyList tab={"Предметов"}/>
    }

    return (
        list.map(subject => (
            <div
                key={subject.id}
                className={`${styles.listItem} ${selectedItem?.id === subject.id ? styles.selected : ''}`}
                onClick={() => setSelected({...subject, tab: 'subjects'})}
            >
                {subject.name}
            </div>
        ))
    );
};

export default AdminManagementSubjects;