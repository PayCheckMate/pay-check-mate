import { createReduxStore } from '@wordpress/data';
import actions from './actions';
import reducer from './reducer';
import selectors from './selectors';
import controls from './controls';
import resolvers from './resolvers';

const PAYROLL_STORE = 'payroll';

const payroll = createReduxStore( PAYROLL_STORE, {
    reducer,
    actions,
    selectors,
    controls,
    resolvers,
} );

export { PAYROLL_STORE };

export default payroll;
