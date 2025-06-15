import { fioIsExist, TAdminManagementDetails } from "@/components/admin-management-details/helper.ts";
import { IStudent } from "@/redux/types.ts";

const AdminManagementDetailsStudents = ({selectedItem}: TAdminManagementDetails<IStudent>) => {
    return (
        <>
            <p><strong>Идентификатор:</strong> {selectedItem.id}</p>
            <p><strong>ФИО:</strong> {fioIsExist(
                selectedItem.first_name,
                selectedItem.last_name,
                selectedItem.email,
                "student"
            )}</p>
            <p><strong>Логин:</strong> {selectedItem.username}</p>
            <p><strong>Группа:</strong> {selectedItem.group || 'Нет группы'}</p>
            <p><strong>Бюджет:</strong> {selectedItem.format === "к" ? "Коммерция" : "Да"}</p>
        </>
    );
};

export default AdminManagementDetailsStudents;