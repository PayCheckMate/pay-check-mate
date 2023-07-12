import actions from "./actions";
import {SalaryHeadType} from "../../Types/SalaryHeadType";
import {defaultFilters} from "./selectors";
import {filtersType} from "../Store";

const resolvers = {
    *getSalaryHeads(filters: filtersType=defaultFilters) {
        const path: string = '/pay-check-mate/v1/salary-heads'
        yield actions.setLoading(true);
        const salaryHeads: SalaryHeadType[] = yield actions.fetchFromAPI(path, filters);
        yield actions.setSalaryHeads(salaryHeads);

        return salaryHeads;
    }
}

export default resolvers;
