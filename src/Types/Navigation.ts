export interface Navigation {
    title: string;
    path: string;
    icon: string;
    current?: boolean;
    children?: Navigation[];
}