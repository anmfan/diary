import MainContainer from "@/components/main-container/MainContainer.tsx";
import styles from './profile.module.css';
import {headerAvatar, userFIO} from "@/redux/selectors/user-selector.ts";
import {useAppSelector} from "@/hooks/store.ts";
import HeaderAvatar from "@/components/header-avatar/HeaderAvatar.tsx";
import Spinner from "@/components/spinner/Spinner.tsx";
import {UsersRoles} from "@/redux/slices/user-slice.ts";
import {toast} from "react-toastify";
import {ChangeEvent, useMemo, useRef, useState} from "react";
import {useGetAdminInfoQuery, useGetUserInfoQuery, useUpdateAvatarMutation} from "@/redux/api/user-api.ts";
import {SERVER_BASE_URL} from "@/const.ts";
import {TGetStudentInfoAccount, TGetTeacherInfoAccount} from "@/redux/api/types.ts";

type UserInfoData = TGetTeacherInfoAccount | TGetStudentInfoAccount;

const Profile = () => {
    const { avatar, username, role } = useAppSelector(headerAvatar);
    const { email } = useAppSelector(userFIO)
    const [updateAvatar, { isLoading }] = useUpdateAvatarMutation();
    const [selectedFile, setSelectedFile] = useState<File | null | string>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isStudentData = (info: UserInfoData | undefined): info is TGetStudentInfoAccount => {
        return !!info && 'averageMark' in info;
    };

    const isTeacherData = (info: UserInfoData | undefined): info is TGetTeacherInfoAccount => {
        return !!info && 'groupsTeachingSubjects' in info;
    };

    const isStudent = role === UsersRoles.student;
    const isTeacher = role === UsersRoles.teacher;
    const isAdmin = role === UsersRoles.admin;

    const { data, isLoading: accountIsLoading } = useGetUserInfoQuery({ email }, { skip: isAdmin })
    const { data: adminData } = useGetAdminInfoQuery(undefined, {skip: !isAdmin})

    const userStats = useMemo(() => {
        if (data && isStudentData(data)) {
            return [
                { title: 'Группа', value: data.groupName },
                { title: 'Средний балл', value: data.averageMark },
                { title: 'Посещаемость', value: data.attendance.attendancePercentage + "%" }
            ];
        }
        if (data && isTeacherData(data)) {
            return [
                { title: 'Управляемые группы', value: data.curatedGroups },
                { title: 'Предметы', value: data.subjects },
                { title: 'Предметы у групп', value: data.groupsTeachingSubjects }
            ]
        }
        return [];
    }, [data]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (!file.type.match('image.*')) {
                toast.error('Пожалуйста, выберите файл изображения');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error('Размер файла не должен превышать 5MB');
                return;
            }

            setSelectedFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancelAvatar = () => {
        setSelectedFile(null);
        setPreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSaveAvatar = async () => {
        if (!selectedFile) return;

        try {
            const formData = new FormData();
            formData.append('avatar', selectedFile);

            await updateAvatar(formData).unwrap();

            toast.success('Аватар успешно обновлен!');
            setSelectedFile(null);
        } catch (error) {
            toast.error('Не удалось обновить аватар');
            console.error('Ошибка при обновлении аватара:', error);
        }
    };


    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    if (accountIsLoading) return <Spinner />

    return (
        <MainContainer>
            <div className={styles.container}>
                <div className={styles.top}>
                    <div className={styles.profileHeader}>
                        <div
                            className={styles.avatarContainer}
                            onClick={handleAvatarClick}
                        >
                            <HeaderAvatar
                                width={150}
                                height={150}
                                avatar={avatar ? SERVER_BASE_URL + avatar : preview}
                            />
                            <div className={styles.avatarOverlay}>
                                <span>Изменить</span>
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />

                        <div className={styles.profileInfo}>
                            <div className={styles.userInfo}>
                                <h1>{username}</h1>
                                <p className={styles.userRole}>
                                    {isStudent && 'Студент'}
                                    {isTeacher && 'Преподаватель'}
                                    {role === UsersRoles.admin && 'Администратор'}
                                </p>
                                <p className={styles.userEmail}>{email}</p>
                            </div>

                            {selectedFile && (
                                <div className={styles.avatarActions}>
                                    <button
                                        className={styles.saveButton}
                                        onClick={handleSaveAvatar}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <Spinner /> : 'Сохранить аватар'}
                                    </button>
                                    <button
                                        className={styles.cancelButton}
                                        onClick={handleCancelAvatar}
                                        disabled={isLoading}
                                    >
                                        Отмена
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.statsContainer}>
                        {isStudent && (
                            userStats.map(({ title, value }) => (
                                <div key={title} className={styles.statItem}>
                                    <h2>{title}</h2>
                                    {!Array.isArray(value) && <h3>{value}</h3>}
                                </div>
                            ))
                        )}

                        {isTeacher && (
                            userStats.map(({ title, value }) => (
                                <div key={title} className={styles.statItem}>
                                    <h2>{title}</h2>

                                    {!Array.isArray(value) || value.length === 0 ? (
                                        <p className={styles.empty}>Нет данных</p>
                                    ) : (
                                        <>
                                            {title === 'Управляемые группы' && value.map(group => {
                                                if ('course' in group && 'students_count' in group) {
                                                    return (
                                                        <div key={group.id}>
                                                            <h4>{group.name}</h4>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}

                                            {title === 'Предметы' && value.map(subject => {
                                                if ('classroom' in subject) {
                                                    return (
                                                        <div key={subject.id}>
                                                            <h4>{subject.name}</h4>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}

                                            {title === 'Предметы у групп' && value.map(item => {
                                                if ('group' in item && 'subject' in item) {
                                                    return (
                                                        <div key={`${item.group.id}-${item.subject.id}`}>
                                                            <h4>{item.group.name}</h4>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </>
                                    )}
                                </div>
                            ))
                        )}

                        {isAdmin && adminData && (
                            <>
                                <div key={adminData.groupsCount} className={styles.statItem}>
                                    <h2>Групп</h2>
                                    <h4>{adminData.groupsCount}</h4>
                                </div>
                                <div key={adminData.studentsCount} className={styles.statItem}>
                                    <h2>Студентов</h2>
                                    <h4>{adminData.studentsCount}</h4>
                                </div>
                                <div key={adminData.subjectsCount} className={styles.statItem}>
                                    <h2>Дисциплин</h2>
                                    <h4>{adminData.subjectsCount}</h4>
                                </div>
                                <div key={adminData.teachersCount} className={styles.statItem}>
                                    <h2>Преподавателей</h2>
                                    <h4>{adminData.teachersCount}</h4>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </MainContainer>
    );
};

export default Profile;