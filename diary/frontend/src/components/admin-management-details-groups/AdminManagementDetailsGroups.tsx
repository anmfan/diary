import { fioIsExist, TAdminManagementDetails } from "@/components/admin-management-details/helper.ts";
import { IGroups } from "@/redux/types.ts";

const AdminManagementDetailsGroups = ({selectedItem}: TAdminManagementDetails<IGroups>) => {
    console.log(selectedItem)
    return (
        <>
            <p><strong>Идентификатор:</strong> {selectedItem.id}</p>
            <p><strong>Название:</strong> {selectedItem.name}</p>
            <p><strong>Куратор:</strong> {fioIsExist("", "", "","group", selectedItem)}</p>
            <p><strong>Курс:</strong> {selectedItem.course}</p>
            <p><strong>Количество студентов:</strong> {selectedItem.students_count}</p>
        </>
    );
};

export default AdminManagementDetailsGroups;