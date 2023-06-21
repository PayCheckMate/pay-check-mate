import actions from "./actions";
import {filtersType, DesignationType} from "../../Types/DesignationType";
import {filter} from "./selectors";

const resolvers = {
    *getDesignations(filters: filtersType=filter) {
        const path: string = '/pay-check-mate/v1/designations'
        yield actions.setLoading(true);
        const designations: DesignationType[] = yield actions.fetchFromAPI(path, filters);
        yield actions.setDesignations(designations);

        return designations;
    }
}

export default resolvers;