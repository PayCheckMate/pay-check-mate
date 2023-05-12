export interface Navigation {
    title: string;
    href: string;
    icon: any;
    current: boolean;
    children?: Navigation[];
}