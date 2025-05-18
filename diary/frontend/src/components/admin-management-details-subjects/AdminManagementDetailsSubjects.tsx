import { TAdminManagementDetails } from "@/components/admin-management-details/helper.ts";
import { ISubject } from "@/redux/types.ts";

const AdminManagementDetailsSubjects = ({selectedItem}: TAdminManagementDetails<ISubject>) => {
    return (
        <>
            <p><strong>Название:</strong> {selectedItem.name}</p>
        </>
    );
};

export default AdminManagementDetailsSubjects;