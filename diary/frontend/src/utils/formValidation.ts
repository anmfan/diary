import {toast} from "react-toastify";

type TFormValidation = {
    email: string;
    password: string;
}

const formValidation = (data: TFormValidation): boolean => {
    const { email, password } = data;

    if (email.length < 3) {
        toast.error('Введите email');
        return false
    }
    if (password.length === 0) {
        toast.error('Введите пароль');
        return false
    }
    if (password.length > 0 && password.length < 6) {
        toast.error("Пароль должен состоять минимум из 6 символов");
        return false
    }
    return true;
}

export { formValidation }