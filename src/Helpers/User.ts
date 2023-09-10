import {UserCapNames, UserType} from "../Types/UserType";
import {useSelect} from "@wordpress/data";
import {store as coreData} from "@wordpress/core-data";
// @ts-ignore
const currentUser = payCheckMate.currentUser as UserType;

export const userCan = (permission: UserCapNames): boolean => {
    console.log(currentUser.allcaps, permission, 'currentUser.allcaps')
    return Object.keys(currentUser.allcaps).includes(permission);
}

export const userIs = (role: string|string[]): boolean => {
    if (Array.isArray(role)) {
        return role.some((r) => Object.values(currentUser.roles).includes(r));
    }

    return Object.values(currentUser.roles).includes(role);
}
