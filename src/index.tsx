import './app.css';
import {render} from "react-dom";
import Dashboard from "./Dashboard";
export default function App() {
    return (
        <>
            <Dashboard />
        </>
    )
}

// Render the app
render( <App />, document.getElementById('root') );