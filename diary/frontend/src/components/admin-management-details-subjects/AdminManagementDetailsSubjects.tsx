import { TAdminManagementDetails } from "@/components/admin-management-details/helper.ts";
import { ISubject } from "@/redux/types.ts";
import {splittingLastName} from "@/components/admin-management-details-subjects/helpers.ts";

const AdminManagementDetailsSubjects = ({ selectedItem }: TAdminManagementDetails<ISubject>) => {
    return (
        <>
            <p><strong>Идентификатор:</strong> {selectedItem.id}</p>
            <p><strong>Название:</strong> {selectedItem.name}</p>
            <p><strong>Преподаватели:</strong>
                {selectedItem.teachers.length > 0 ? selectedItem.teachers.map(teacher => (
                  <span key={teacher.id}>
                      {" " + teacher.user.first_name + " " + splittingLastName(teacher.user.last_name)}
                  </span>
                )) : " Не прикреплены"}
            </p>
            <p><strong>Аудитория:</strong> {selectedItem.classroom || "Нет аудитории"}</p>
            <p><strong>Группы:</strong>
                {selectedItem.assigned_groups.length > 0 ? selectedItem.assigned_groups.map((group, index) => (
                    <span key={group.id}>
                        {" " + group.name}
                        {index < selectedItem.assigned_groups.length - 1 ? ", " : ""}
                    </span>
                )) : " Не прикреплены"}
            </p>
        </>
    );
};

export default AdminManagementDetailsSubjects;