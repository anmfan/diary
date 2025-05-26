import {useAppDispatch} from "@/hooks/store.ts";
import {removeGroup} from "@/redux/thunks/teachers-thunk.ts";
import {TSelectedItem} from "@/components/admin-management/types.ts";
import styles from './styles.module.css';
import useModal from "@/hooks/useModal.tsx";
import useSetSelectedItem from "@/hooks/useSetSelectedItem.ts";

type TModalEditRemoveGroup = {
    item: TSelectedItem;
    groups?: string | undefined;
    group?: string | null;
}

const ModalEditRemoveGroup = ({item, groups, group}: TModalEditRemoveGroup) => {
    const dispatch = useAppDispatch();
    const { closeModal } = useModal();
    const { setSelected } = useSetSelectedItem();
    const userId = item?.id || 0

    const handleClick = () => {
        dispatch(removeGroup({user_id: userId}))
        closeModal()
        setSelected(null)
    }

    return (
        <div className={styles.btnRemoveBlock}>
            <span>{group ? group : groups}</span>
            <button
                className={styles.removeGroupBtn}
                onClick={handleClick}
                type="button"
            >
                Открепить
            </button>
        </div>
    );
};

export default ModalEditRemoveGroup;