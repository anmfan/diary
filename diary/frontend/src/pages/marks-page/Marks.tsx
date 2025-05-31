import MainContainer from "@/components/main-container/MainContainer.tsx";
import styles from './styles.module.css';
import MarksTable from "@/components/marks-table/MarksTable.tsx";

const Marks = () => {
    return (
        <MainContainer>
            <div className={styles.container}>
                <h1 className={styles.title}>Журнал оценок</h1>
                <MarksTable />
            </div>
        </MainContainer>
    );
};

export default Marks;