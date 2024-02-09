import {userCan} from "../Helpers/User";
import {UserCapNames} from "../Types/UserType";
import {PermissionDenied} from "./404";
import {Card} from "./Card";

type HOCProps = {
    role: UserCapNames;
    children: React.ReactNode;
    title?: string;
}
export const HOC = ({role, children, title}: HOCProps) => {
    if (!userCan(role)) {
        return (
            <Card className="overflow-hidden bg-white shadow sm:rounded-lg py-8 px-8 w-full mt-2">
                <PermissionDenied />
            </Card>
        );
    }

    return <>
        {title && (
            <div className="sm:flex sm:items-center mb-6">
                <div className="sm:flex-auto">
                    <h1 className="heading text-base font-semibold leading-6 text-gray-900">
                        {title}
                    </h1>
                </div>
            </div>
        )}
        {children}
    </>;
}

// @ts-ignore
window.HOC = HOC;
