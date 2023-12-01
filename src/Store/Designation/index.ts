import { createReduxStore } from '@wordpress/data';
import actions from './actions';
import reducer from './reducer';
import selectors from './selectors';
import controls from './controls';
import resolvers from './resolvers';

const DESIGNATION_STORE = 'pay_check_mate/designation';

const designations = createReduxStore( DESIGNATION_STORE, {
    reducer,
    actions,
    selectors,
    controls,
    resolvers,
} );

export { DESIGNATION_STORE };

export default designations;
