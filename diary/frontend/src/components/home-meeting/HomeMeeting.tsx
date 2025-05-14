import styles from './home-meeting.module.css'
import useAuth from "@/hooks/useAuth.tsx";
import HomeMeetingNotAuth from "../home-meeting-not-auth/HomeMeetingNotAuth.tsx";
import HomeMeetingAuth from "../home-meeting-auth/HomeMeetingAuth.tsx";
import { motion } from 'motion/react';

const HomeMeeting = () => {
    const isAuth = useAuth();

    return (
        <motion.div
            className={styles.container}
            initial={{y: -300, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{type: "tween", stiffness: 100}}
        >
            {!isAuth && <HomeMeetingNotAuth/>}
            {isAuth && <HomeMeetingAuth/>}
        </motion.div>
    );
};

export default HomeMeeting;