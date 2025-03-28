export interface IUserInitialState {
    isAuthenticated: boolean;
    user: {
        username: string | null;
        email: string | null;
        firstName: string | null;
        lastName: string | null;
    },
    loadingIsDone: boolean;
    isError: boolean;
}

export interface IUser {
    username: string;
    email: string;
}

interface IUserData {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface IUserReturned {
    message: string;
    accessToken: string;
    user: IUserData;
}