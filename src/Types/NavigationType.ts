export interface NavigationType {
    key: string;
    title: string;
    href: string;
    icon: any;
    roles: string[];
    current?: boolean;
    children?: NavigationType[];
}

export interface NavbarLinkProps {
    navigation: NavigationType[];
}
