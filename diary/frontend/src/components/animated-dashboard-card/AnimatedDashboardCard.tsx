import { motion } from "motion/react";
import {ReactNode} from "react";
import {cardVariants} from "@/pages/home-page/animations.ts";

const AnimatedDashboardCard = ({ children, index = 0 }: { children: ReactNode; index?: number }) => {
    return (
        <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
            transition={{ delay: index * 0.1 }}
        >
            {children}
        </motion.div>

    );
};

export default AnimatedDashboardCard;