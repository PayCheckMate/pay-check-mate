import './app.css';
import {render} from "react-dom";

import { HashRouter } from "react-router-dom";
import Main from "./Pages/Main";

export default function App() {
    return (
        <HashRouter>
            <Main />
        </HashRouter>
    )
}

// Render the app
render( <App />, document.getElementById('root') );