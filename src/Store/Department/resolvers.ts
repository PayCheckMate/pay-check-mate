import actions from "./actions";
import {DepartmentType} from "../../Types/DepartmentType";
import {filter} from "./selectors";
import {filtersType} from "../Store";

const resolvers = {
    *getDepartments(filters: filtersType=filter) {
        const path: string = '/pay-check-mate/v1/departments'
        yield actions.setLoading(true);
        const departments: DepartmentType[] = yield actions.fetchFromAPI(path, filters);
        yield actions.setDepartments(departments);

        return departments;
    }
}

export default resolvers;
