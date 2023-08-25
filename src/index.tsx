import {createRoot} from '@wordpress/element';
import './app.css';
import './Store/Store';

import {HashRouter} from "react-router-dom";
import Main from "./Pages/Main";
import {ColorPallets} from "./ColorPallets";

export default function App() {
    return (
        <HashRouter>
            <Main/>
            <ColorPallets />
        </HashRouter>
    )
}

// Render the app
// @ts-ignore
createRoot(document.getElementById('pcm-root')).render(<App/>);
