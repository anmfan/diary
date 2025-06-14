import {ROUTES_ENDPOINTS} from "@/components/routes/const.tsx";
import {UsersRoles} from "@/redux/slices/user-slice.ts";
import {UserRole} from "@/redux/types.ts";
import {JSX} from "react";

export type TDropdownMenuItem = {
    title: string;
    path?: string;
    icon: JSX.Element;
    type?: 'link' | 'logout';
}

export const dropdownMenuItems = (role: UserRole): TDropdownMenuItem[] => {
    const items: TDropdownMenuItem[] = [
        {
            title: "Профиль",
            path: ROUTES_ENDPOINTS.PROFILE,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                       className="bi bi-person" viewBox="0 0 16 16">
                <path
                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
            </svg>
        },
    ]

    if (role === UsersRoles.admin || role === UsersRoles.teacher) {
        items.push({
            title: "Управление",
            path: ROUTES_ENDPOINTS.MANAGEMENT,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                       className="bi bi-kanban" viewBox="0 0 16 16">
                <path
                    d="M13.5 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm-11-1a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                <path
                    d="M6.5 3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1zm-4 0a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1zm8 0a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1z"/>
            </svg>
        })
    }

    items.push({
        title: "Выйти",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                   className="bi bi-escape" viewBox="0 0 16 16">
            <path
                d="M8.538 1.02a.5.5 0 1 0-.076.998 6 6 0 1 1-6.445 6.444.5.5 0 0 0-.997.076A7 7 0 1 0 8.538 1.02"/>
            <path
                d="M7.096 7.828a.5.5 0 0 0 .707-.707L2.707 2.025h2.768a.5.5 0 1 0 0-1H1.5a.5.5 0 0 0-.5.5V5.5a.5.5 0 0 0 1 0V2.732z"/>
        </svg>,
        type: 'logout'
    }
    )

    return items;
}