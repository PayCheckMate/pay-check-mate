import { createReduxStore } from '@wordpress/data';
import actions from './actions';
import reducer from './reducer';
import selectors from './selectors';
import controls from './controls';
import resolvers from './resolvers';

const SALARY_HEAD_STORE = 'pcm/salary-head';

const salaryHead = createReduxStore( SALARY_HEAD_STORE, {
    reducer,
    actions,
    selectors,
    controls,
    resolvers,
} );

export { SALARY_HEAD_STORE };

export default salaryHead;
