import {createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState} from "react";

type TScheduleWeekContextType = {
    weekOffset: number;
    setWeekOffset: Dispatch<SetStateAction<number>>;
}

const ScheduleWeekContext = createContext<TScheduleWeekContextType | undefined>(undefined);

const ScheduleWeekProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [weekOffset, setWeekOffset] = useState(0);

    return (
        <ScheduleWeekContext.Provider value={{ weekOffset, setWeekOffset }}>
            {children}
        </ScheduleWeekContext.Provider>
    );
};


const useScheduleWeek = () => {
    const context = useContext(ScheduleWeekContext);
    if (!context) throw new Error("useScheduleWeek must be used within ScheduleWeekProvider");
    return context;
};

export { ScheduleWeekProvider, useScheduleWeek }