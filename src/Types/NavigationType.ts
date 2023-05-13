export interface NavigationType {
    title: string;
    href: string;
    icon: any;
    roles: string[];
    current?: boolean;
    children?: NavigationType[];
}