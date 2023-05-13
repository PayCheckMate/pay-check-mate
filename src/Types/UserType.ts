export interface UserType {
    ID: number;
    allcaps: {
        [key: string]: boolean;
    };
    cap_key: string;
    caps: {
        [key: string]: boolean;
    }
    data: any;
    filter: any;
    roles: string[];
}