import actions from "./actions";
import {PayrollType} from "../../Types/PayrollType";
import {filtersType} from "../Store";
import {defaultFilters} from "./selectors";

const resolvers = {
    *getPayrolls(filters: filtersType=defaultFilters) {
        const path: string = '/pay-check-mate/v1/payrolls'
        yield actions.setLoading(true);
        const salaryHeads: PayrollType[] = yield actions.fetchFromAPI(path, filters);
        yield actions.setPayrolls(salaryHeads);

        return salaryHeads;
    }
}

export default resolvers;
