import { ROUTES_ENDPOINTS } from "../routes/const.tsx";

interface IHeaderListItems {
    id: number;
    title: string;
    path: string;
}

export const HEADER_LIST_ITEMS: IHeaderListItems[] = [
    {
        id: 0,
        title: 'Главная',
        path: ROUTES_ENDPOINTS.HOME
    },
    {
        id: 1,
        title: 'Дневник',
        path: ROUTES_ENDPOINTS.DIARY
    },{
        id: 2,
        title: 'Оценки',
        path: ROUTES_ENDPOINTS.MARKS
    },
]