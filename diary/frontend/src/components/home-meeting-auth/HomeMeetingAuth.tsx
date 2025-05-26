import styles from './home-meeting-auth.module.css';
import {useAppSelector} from "@/hooks/store.ts";
import {memoUserFIO} from "@/redux/selectors/user-selector.ts";
import Spinner from "../spinner/Spinner.tsx";

const HomeMeetingAuth = () => {
    const name = useAppSelector(memoUserFIO);

    if (!name) {
        return <Spinner />;
    }

    return (
        <h2 className={styles.greeting}>Здравствуйте, {name.lastName || name.username}</h2>
    );
};

export default HomeMeetingAuth;