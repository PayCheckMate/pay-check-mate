import {UserType} from "../Types/UserType";
import {useSelect} from "@wordpress/data";
import {store as coreData} from "@wordpress/core-data";
// @ts-ignore
const currentUser = payCheckMate.currentUser as UserType;

export const userCan = (permission: string): boolean => {
    // useSelect((select) => {
    //     console.log(select(coreData).getCurrentUser())
    // }, [])
    return Object.keys(currentUser.allcaps).includes(permission);
}

export const userIs = (role: string|string[]): boolean => {
    if (Array.isArray(role)) {
        return role.some((r) => Object.values(currentUser.roles).includes(r));
    }

    return Object.values(currentUser.roles).includes(role);
}
