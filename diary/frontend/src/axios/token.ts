import Cookies from 'js-cookie';

const ACCESS_TOKEN_NAME = 'AccessToken'

const getToken = () => {
    return Cookies.get(ACCESS_TOKEN_NAME) ?? '';
}

const saveToken = (token: string) => {
    return Cookies.set(ACCESS_TOKEN_NAME, token);
}

const deleteToken = () => {
    Cookies.remove(ACCESS_TOKEN_NAME);
}

export {getToken, saveToken, deleteToken};