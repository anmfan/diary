import {editGroup} from "@/redux/thunks/groups-thunk.ts";
import {editSubject} from "@/redux/thunks/subjects-thunk.ts";
import {AsyncThunk} from "@reduxjs/toolkit";

export type TModalEditGroupSubjectCommonType = {
    type: 'group' | 'subject';
    entityName: 'newGroupName' | 'newSubjectName';
    entityId: 'groupId' | 'subjectId';
    thunk: AsyncThunk<any, any, any>;
};

export const modalEditGroupSubject = {
    group: {
        type: 'group',
        entityName: 'newGroupName',
        entityId: 'groupId',
        thunk: editGroup
    } as const,
    subject: {
        type: 'subject',
        entityName: 'newSubjectName',
        entityId: 'subjectId',
        thunk: editSubject
    } as const
};
