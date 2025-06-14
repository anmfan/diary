import { useAppSelector } from "@/hooks/store.ts";
import { userFIO } from "@/redux/selectors/user-selector.ts";
import { useGetGroupDataQuery, useGetSubjectsQuery } from "@/redux/api/teacher-management-api.ts";

const useGetGroupInfo = () => {
    const { email } = useAppSelector(userFIO)
    const { data: groupData, isLoading } = useGetGroupDataQuery({ email: email! })

    const groupIds = groupData?.map(group => group.id) ?? [];

    const { data: subjects, isLoading: isSubjectsLoading } = useGetSubjectsQuery(
        { groupIds },
        { skip: groupIds.length === 0 }
    )

    return { groupIds, groupData, isLoading, subjects, isSubjectsLoading }
};

export default useGetGroupInfo;