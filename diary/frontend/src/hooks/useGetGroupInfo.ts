import { useAppSelector } from "@/hooks/store.ts";
import { userFIO } from "@/redux/selectors/user-selector.ts";
import { useGetGroupDataQuery, useGetSubjectsQuery } from "@/redux/api/teacher-management-api.ts";

const useGetGroupInfo = () => {
    const { email } = useAppSelector(userFIO)
    const { data: groupData, isLoading } = useGetGroupDataQuery({ email: email! })

    const groupId = groupData?.id || 0;

    const { data: subjects, isLoading: isSubjectsLoading } = useGetSubjectsQuery(
        { groupId },
        { skip: !groupId }
    )

    return { groupData, isLoading, subjects, isSubjectsLoading }
};

export default useGetGroupInfo;