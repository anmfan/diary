import {fioIsExist, TAdminManagementDetails} from "@/components/admin-management-details/helper.ts";
import {ITeacher} from "@/redux/types.ts";

const AdminManagementDetailsTeachers = ({selectedItem}: TAdminManagementDetails<ITeacher>) => {
    return (
        <>
            <p><strong>Идентификатор:</strong> {selectedItem.id}</p>
            <p><strong>ФИО:</strong> {fioIsExist(
                selectedItem.first_name,
                selectedItem.last_name,
                selectedItem.email,
                "teacher"
            )}</p>
            <p><strong>Логин:</strong> {selectedItem.username}</p>
            <p><strong>Прикрепленные группы:</strong>
                &nbsp;{
                    selectedItem.curated_groups.length > 0
                        ? selectedItem.curated_groups.map(group => group.name).join(', ')
                        : "Нет группы"
                }
            </p>
        </>
    );
};

export default AdminManagementDetailsTeachers;