import styles from './home-meeting-auth.module.css';
import {useAppSelector} from "@/hooks/store.ts";
import {userName} from "@/redux/selectors/user-selector.ts";
import Spinner from "../spinner/Spinner.tsx";


const HomeMeetingNotAuth = () => {
    const username = useAppSelector(userName);

    if (!username) {
        return <Spinner />;
    }

    return (
        <h2 className={styles.greeting}>Здравствуйте, {username}</h2>
    );
};

export default HomeMeetingNotAuth;