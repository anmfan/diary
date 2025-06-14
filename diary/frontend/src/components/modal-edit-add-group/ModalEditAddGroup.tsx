import {useAppDispatch, useAppSelector} from "@/hooks/store.ts";
import {TabsOptions, TSelectedItem} from "@/components/admin-management/types.ts";
import {addGroup} from "@/redux/thunks/teachers-thunk.ts";
import {allGroups, groupsWithoutCurator} from "@/redux/selectors/groups-selector.ts";
import styles from "./styles.module.css"
import {TAddGroupForm} from "@/redux/types.ts";
import {ChangeEvent, useState} from "react";
import {toast} from "react-toastify";
import useModal from "@/hooks/useModal.tsx";
import useSetSelectedItem from "@/hooks/useSetSelectedItem.ts";

const ModalEditAddGroup = ({item}: {item: TSelectedItem}) => {
    const dispatch = useAppDispatch();
    const groupsForAdding = useAppSelector(groupsWithoutCurator);
    const role = item?.tab;
    const groups = useAppSelector(allGroups)
    const { closeModal } = useModal();
    const { setSelected } = useSetSelectedItem();
    const [addGroupData, setAddGroupData] = useState<TAddGroupForm>({
        groupId: ''
    })

    const userId = item?.id || 0

    const handleClick = async () => {
        if (!addGroupData.groupId) return;
        try {
            await dispatch(addGroup({...addGroupData, userId})).unwrap()
            closeModal()
            setSelected(null)
        } catch (e) {
            toast.error(typeof e === 'string' ? e : "Произошла ошибка")
        }
    }

    const onChangeGroup = (e: ChangeEvent<HTMLSelectElement>) => {
        setAddGroupData({ groupId: e.target.value })
    }

    const list = role === TabsOptions.teachers ? groupsForAdding : groups;

    return (
        <div className={styles.groupsInfo}>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <select onChange={onChangeGroup} className={styles.selector}>
                    <option value="">Выберите группу</option>
                    {list.map(group => (
                        <option key={group.id} value={group.id}>
                            {group.name}
                        </option>
                    ))}
                </select>
                <button onClick={handleClick} type="button" title="Прикрепить группу">Прикрепить</button>
            </div>
        </div>
    );
};

export default ModalEditAddGroup;