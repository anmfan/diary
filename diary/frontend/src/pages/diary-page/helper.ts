import {TScheduleGroups} from "@/redux/api/types.ts";
import {UserRole} from "@/redux/types.ts";

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

export type RoleBasedSchedule<R extends UserRole> =
    R extends 'teacher' ? TScheduleGroups<'teacher'> : TScheduleGroups<'student'>

const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return days[date.getDay()];
};

const compareDates = (a: string, b: string) => {
    return new Date(a).getTime() - new Date(b).getTime();
};

const getLessonCountText = (count: number) => {
    if (count % 10 === 1 && count % 100 !== 11) return 'пара';
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'пары';
    return 'пар';
};

const formatDateToMonth = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}.${month}`;
};

export { formatDate, getLessonCountText, getDayName, compareDates, formatDateToMonth }