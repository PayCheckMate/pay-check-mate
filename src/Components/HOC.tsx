import {userCan} from "../Helpers/User";
import {UserCapNames} from "../Types/UserType";
import {PermissionDenied} from "./404";
import {Card} from "./Card";

type HOCProps = {
    role: UserCapNames;
    children: React.ReactNode;
}
export const HOC = ({role, children}: HOCProps) => {
    if (!userCan(role)) {
        return (
            <Card>
                <PermissionDenied />
            </Card>
        );
    }

    return <>{children}</>;
}
