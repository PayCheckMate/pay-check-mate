import { createReduxStore } from '@wordpress/data';
import actions from './actions';
import reducer from './reducer';
import selectors from './selectors';
import controls from './controls';
import resolvers from './resolvers';

const DEPARTMENT_STORE = 'department';

const department = createReduxStore( DEPARTMENT_STORE, {
    reducer,
    actions,
    selectors,
    controls,
    resolvers,
} );

export { DEPARTMENT_STORE };

export default department;
