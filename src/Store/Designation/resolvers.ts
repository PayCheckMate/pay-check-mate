import actions from "./actions";
import {DesignationType} from "../../Types/DesignationType";
import {defaultFilters} from "./selectors";
import {filtersType} from "../Store";

const resolvers = {
    *getDesignations(filters: filtersType=defaultFilters) {
        const path: string = '/pay-check-mate/v1/designations'
        yield actions.setLoading(true);
        const designations: DesignationType[] = yield actions.fetchFromAPI(path, filters);
        yield actions.setDesignations(designations);

        return designations;
    },
    *getDesignation(id: number) {
        this.getDesignations();
    }
}

export default resolvers;
