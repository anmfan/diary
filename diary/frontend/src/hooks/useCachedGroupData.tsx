import {useAppSelector} from "@/hooks/store.ts";
import {teacherManagementApi} from "@/redux/api/teacher-management-api.ts";

const useGetCachedGroupData = ({ email }: {email: string}) => {
    return useAppSelector(teacherManagementApi.endpoints.getGroupData.select({ email }))
};

export default useGetCachedGroupData;