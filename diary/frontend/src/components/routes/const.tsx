import {lazy} from "react";

const Profile = lazy(() => import('@/pages/profile-page/Profile.tsx'))
const Diary = lazy(() => import('@/pages/diary-page/Diary.tsx'));
const Marks = lazy(() => import('@/pages/marks-page/Marks.tsx'));
const Auth = lazy(() => import('@/pages/auth-page/Auth.tsx'));
const Management = lazy(() => import("@/pages/management-page/Management.tsx"));
const Settings = lazy(() => import("@/pages/settings-page/Settings.tsx"));

export const ROUTES_ENDPOINTS = {
    HOME: '/',
    PROFILE: '/account',
    DIARY: '/diary',
    MARKS: '/marks',
    NOT_FOUND: '*',
    AUTH: '/auth',
    SETTINGS: '/settings',
    MANAGEMENT: '/management',
}

export const ROUTES = [
    {
        id: 0,
        path: ROUTES_ENDPOINTS.PROFILE,
        element: <Profile/>
    },
    {
        id: 1,
        path: ROUTES_ENDPOINTS.DIARY,
        element: <Diary/>
    },
    {
        id: 2,
        path: ROUTES_ENDPOINTS.MARKS,
        element: <Marks/>
    },
    {
        id: 3,
        path: ROUTES_ENDPOINTS.AUTH,
        element: <Auth/>
    },
    {
        id: 4,
        path: ROUTES_ENDPOINTS.MANAGEMENT,
        element: <Management/>
    },
    {
        id: 5,
        path: ROUTES_ENDPOINTS.SETTINGS,
        element: <Settings/>
    },
]