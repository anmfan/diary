import {useAppSelector} from "@/hooks/store.ts";
import {scheduleApi} from "@/redux/api/schedule-api.ts";

const useGetCachedGroupData = ({ groupId, weekOffset }: {groupId: number | null, weekOffset?: number}) => {
    return useAppSelector(scheduleApi.endpoints.getSchedulesByGroup.select({ groupId, weekOffset }))
};

export default useGetCachedGroupData;