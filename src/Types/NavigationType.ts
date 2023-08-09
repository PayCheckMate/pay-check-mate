export interface NavigationType {
    key: string;
    title: string;
    href: string;
    icon: any;
    roles: string[];
    current?: boolean;
    children?: NavigationType[];
    component?: any;
}

export interface NavbarLinkProps {
    navigation: NavigationType[];
}
