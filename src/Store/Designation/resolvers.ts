import actions from "./actions";
import {argsType, DesignationType} from "../../Types/DesignationType";

const resolvers = {
    *getDesignations(args: argsType) {
        const path: string = '/pay-check-mate/v1/designations'
        const designations: DesignationType[] = yield actions.fetchFromAPI(path, args);
        yield actions.setDesignations(designations);

        return designations;
    }
}

export default resolvers;