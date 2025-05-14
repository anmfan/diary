import { UseFormSetValue } from "react-hook-form";
import { TCreateUser } from "@/redux/types.ts";

export const generateLogin = <T extends 2 | 3>(setValue: UseFormSetValue<TCreateUser<T>>) => {
    let result = '';
    const lengthOfLogin = 10;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < lengthOfLogin; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return setValue('username', result)
}