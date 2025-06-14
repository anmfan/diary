import styles from "@/pages/marks-page/styles.module.css";
import { Dispatch, SetStateAction } from "react";
import { TGetGroupsAndSubjectsByTeacher } from "@/redux/api/types.ts";

type TMarksSelector = {
    selectedGroup: string | undefined;
    setSelectedGroup: (groupName: string) => void;
    setSelectedSubject: Dispatch<SetStateAction<number | null>>;
    groupData:  TGetGroupsAndSubjectsByTeacher[] | null | undefined;
    selectedSubject: number | null;
    currentSubjectsByGroup: { subjectId: number; subjectName: string }[] | undefined;
}

const MarksSelectors = (
    {
        selectedGroup,
        setSelectedGroup,
        setSelectedSubject,
        groupData,
        selectedSubject,
        currentSubjectsByGroup}: TMarksSelector) => {
    return (
        <div className={styles.controls}>
            <label htmlFor="group-select" className={styles.label}>
                Выберите группу:
            </label>
            <select
                id="group-select"
                value={selectedGroup}
                onChange={({target}) => setSelectedGroup(target.value)}
                className={styles.select}
            >
                {groupData?.map((group) => (
                    <option key={group?.groupId} value={group?.groupName}>
                        {group?.groupName}
                    </option>
                ))}
            </select>
            <select
                id="subject-select"
                value={selectedSubject !== null ? selectedSubject.toString() : ""}
                onChange={({target}) => setSelectedSubject(Number(target.value))}
                className={styles.select}
            >
                {currentSubjectsByGroup?.map((subject) => (
                    <option key={subject.subjectId} value={subject.subjectId}>
                        {subject.subjectName}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default MarksSelectors;