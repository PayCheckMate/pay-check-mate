import {UserType} from "../Types/UserType";
// @ts-ignore
const currentUser = payCheckMate.currentUser as UserType;

export const userCan = (permission: string): boolean => {
    return Object.keys(currentUser.allcaps).includes(permission);
}

export const userIs = (role: string|string[]): boolean => {
    if (Array.isArray(role)) {
        return role.some((r) => currentUser.roles.includes(r));
    }
    return currentUser.roles.includes(role);
}