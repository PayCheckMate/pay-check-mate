import {addFilter} from "./Helpers/Hooks";
import {__} from "@wordpress/i18n";
import {useState} from "@wordpress/element";

addFilter('pay_check_mate.button_class_name', 'pay_check_mate.button_class_name', (className: string) => {
    if (localStorage.getItem('currentTheme') === 'dark') {
        return className
    }
    return 'btn-primary';
});

// Change anchor link class
addFilter('pay_check_mate.anchor_class', 'pay_check_mate.anchor_class', (className: string) => {
    if (localStorage.getItem('currentTheme') === 'dark') {
        return className
    }
    return 'anchor-link';
});

// Change active status class
addFilter('pay_check_mate.status_color_active', 'pay_check_mate.status_color_active', (className: string) => {
    if (localStorage.getItem('currentTheme') === 'dark') {
        return className
    }
    return 'green';
});

// Change inactive status class
addFilter('pay_check_mate.status_color_inactive', 'pay_check_mate.status_color_inactive', (className: string) => {
    if (localStorage.getItem('currentTheme') === 'dark') {
        return className
    }
    return 'red';
});

// Change color
addFilter('pay_check_mate.indigo', 'pay_check_mate.indigo', (className: string) => {
    if (localStorage.getItem('currentTheme') === 'dark') {
        return className
    }
    return 'indigo';
});
addFilter('pay_check_mate.blue', 'pay_check_mate.blue', (className: string) => {
    if (localStorage.getItem('currentTheme') === 'dark') {
        return className
    }
    return 'blue';
});
addFilter('pay_check_mate.red', 'pay_check_mate.red', (className: string) => {
    if (localStorage.getItem('currentTheme') === 'dark') {
        return className
    }
    return 'red';
});
addFilter('pay_check_mate.orange', 'pay_check_mate.orange', (className: string) => {
    if (localStorage.getItem('currentTheme') === 'dark') {
        return className
    }
    return 'orange';
});
addFilter('pay_check_mate.green', 'pay_check_mate.green', (className: string) => {
    if (localStorage.getItem('currentTheme') === 'dark') {
        return className
    }
    return 'green';
});


addFilter('pay_check_mate.dropZoneStyleColor', 'pay_check_mate.dropZoneStyleColor', (className: string) => {
    if (localStorage.getItem('currentTheme') === 'dark') {
        return className
    }
    return 'rgba(159,239,207,0.5)';
});
addFilter('pay_check_mate.earning_class', 'pay_check_mate.earning_class', (className: string) => {
    if (localStorage.getItem('currentTheme') === 'dark') {
        return className
    }
    return 'earning'
});
addFilter('pay_check_mate.total_earnings_class', 'pay_check_mate.total_earnings_class', (className: string) => {
    if (localStorage.getItem('currentTheme') === 'dark') {
        return className
    }
    return 'total_earnings'
});
addFilter('pay_check_mate.deduction_class', 'pay_check_mate.deduction_class', (className: string) => {
    if (localStorage.getItem('currentTheme') === 'dark') {
        return className
    }
    return 'deduction'
});
addFilter('pay_check_mate.total_deductions_class', 'pay_check_mate.total_deductions_class', (className: string) => {
    if (localStorage.getItem('currentTheme') === 'dark') {
        return className
    }
    return 'total_deductions'
});
addFilter('pay_check_mate.net_payable_class', 'pay_check_mate.net_payable_class', (className: string) => {
    if (localStorage.getItem('currentTheme') === 'dark') {
        return className
    }
    return 'net_payable'
});
addFilter('pay_check_mate.total_payable_class', 'pay_check_mate.total_payable_class', (className: string) => {
    if (localStorage.getItem('currentTheme') === 'dark') {
        return className
    }
    return 'total_payable'
});
addFilter('pay_check_mate.non_taxable_class', 'pay_check_mate.non_taxable_class', (className: string) => {
    if (localStorage.getItem('currentTheme') === 'dark') {
        return className
    }
    return 'non_taxable'
});


// Chart color
addFilter('pay_check_mate.chart_background_color', 'pay_check_mate.chart_background_color', (className: string) => {
    if (localStorage.getItem('currentTheme') === 'dark') {
        return className
    }
    return 'rgba(99,237,255, .7)';
});
addFilter('pay_check_mate.chart_border_color', 'pay_check_mate.chart_border_color', (className: string) => {
    if (localStorage.getItem('currentTheme') === 'dark') {
        return className
    }
    return 'rgb(8,136,152)';
});


// Theme color
addFilter('pay_check_mate.theme_switcher', 'pay_check_mate.theme_switcher', (color: string) => {
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('currentTheme') || 'light');
    const setTheme = (theme: string) => {
        localStorage.setItem('currentTheme', currentTheme === 'dark' ? 'light' : 'dark');
        setCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }
    return (
        <>
            {currentTheme === 'dark' && (
                <button
                    onClick={()=>setTheme('dark')}
                    title={__('Colored Theme', 'pcm')}
                    className="fixed z-90 bottom-10 right-8 bg-indigo-200 w-16 h-16 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-indigo-500 hover:drop-shadow-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 512 512"><path fill="#FFE46A" d="M411.111 183.926c0-87.791-68.91-158.959-153.914-158.959S103.283 96.136 103.283 183.926c0 39.7 14.093 75.999 37.392 103.856h-.001l33.666 61.027c8.793 16.28 12.057 26.792 26.792 26.792h109.774c14.736 0 19.071-11.07 26.792-26.792l36.022-61.027h-.002c23.299-27.857 37.393-64.156 37.393-103.856z"/><path fill="#FFF0B7" d="M112.805 203.285c0-90.721 68.378-165.701 157.146-177.719a150.851 150.851 0 0 0-13.319-.599c-85.004 0-153.914 71.169-153.914 158.959c0 28.89 7.469 55.974 20.512 79.319c-6.75-18.749-10.425-38.932-10.425-59.96z"/><path fill="#FFDA00" d="M411.111 184.266c0-31.445-8.843-60.755-24.097-85.428a160.416 160.416 0 0 1 4.917 39.416c0 104.454-101.138 189.522-227.481 192.967l9.89 17.929c8.793 16.28 12.057 26.792 26.792 26.792h109.774c14.736 0 19.071-11.07 26.792-26.792l36.022-61.027h-.002c23.299-27.858 37.393-64.157 37.393-103.857z"/><path fill="#FAAF63" d="M321.905 211.203c.149-.131.297-.251.447-.395c2.787-2.667 5.082-6.921 3.161-10.867c-7.879-16.176-31.97-21.308-49.524-15.951c-.889.271-1.751.566-2.588.885c-9.562-5.583-21.434-6.925-32.001-3.569a35.399 35.399 0 0 0-3.678 1.394c-5.785-3.38-12.552-5.066-19.294-4.414c-14.112 1.365-26.375 12.81-28.805 26.752l-1.112.688c9.617 15.541 34.93 60.071 36.552 79.233c2.045 24.174.002 89.793-.019 90.453l11.994.379c.086-2.723 2.086-66.978-.019-91.844c-.938-11.087-7.722-28.758-20.164-52.521c-5.807-11.092-11.445-20.83-14.858-26.576c2.36-7.646 9.61-13.848 17.586-14.619c2.429-.235 4.893.037 7.251.729a22.68 22.68 0 0 0-2.32 3.638c-4.047 7.935-2.356 17.898 3.933 23.176c3.725 3.125 9.137 4.276 14.127 3c4.647-1.188 8.239-4.242 9.854-8.379c1.451-3.718 1.328-8.01-.367-12.756a30.665 30.665 0 0 0-4.05-7.655a28.134 28.134 0 0 1 13.61.744c-1.715 1.975-3.027 4.173-3.89 6.556c-1.844 5.101-1.029 11.163 2.128 15.822c2.721 4.016 6.856 6.403 11.348 6.551c.15.005.301.008.45.008c3.935 0 7.67-1.692 10.562-4.797c3.397-3.647 5.126-8.71 4.624-13.544c-.319-3.073-1.412-6.079-3.172-8.867c12.236-2.223 24.205 1.911 29.383 8.186c-3.125 5.2-9.542 16.11-16.178 28.785c-12.441 23.764-19.227 41.435-20.164 52.521c-2.104 24.866-.104 89.121-.019 91.844l11.994-.379c-.021-.66-2.064-66.275-.019-90.453c1.459-17.251 22.113-55.046 33.237-73.758zm-80.657-3.171c-.279.716-1.331 1.035-1.647 1.116c-1.25.319-2.665.086-3.442-.565c-2.015-1.691-2.453-5.599-.957-8.532a11.21 11.21 0 0 1 1.85-2.583c1.611 1.828 2.892 3.926 3.707 6.208c.665 1.86.843 3.449.489 4.356zm32.19.654c-.351.375-1.065.992-1.839.976c-.831-.027-1.489-.819-1.808-1.289c-.993-1.467-1.312-3.527-.776-5.009c.618-1.71 1.811-3.109 3.203-4.235c1.55 1.751 2.501 3.634 2.688 5.434c.144 1.371-.447 3.027-1.468 4.123z"/><path fill="#6B83A5" d="M315.932 402.701H197.897c-6.6 0-12 5.4-12 12v6.957c0 6.6 5.4 12 12 12h38.122c-11.367 4.229-23.369 14.285-23.369 25.946v4.68c9.123 10.254 17.619 28.081 33.802 28.081h21.89c12.748 0 21.804-13.762 32.836-28.081v-4.68c0-11.661-11.451-21.717-22.548-25.946h37.302c6.6 0 12-5.4 12-12v-6.957c0-6.6-5.4-12-12-12z"/><path fill="#ABBDDB" d="M324.406 402.701H189.423c-6.6 0-12-5.4-12-12v-6.957c0-6.6 5.4-12 12-12h134.983c6.6 0 12 5.4 12 12v6.957c0 6.6-5.4 12-12 12zm-7.007 49.915v-6.957c0-6.6-5.4-12-12-12H208.43c-6.6 0-12 5.4-12 12v6.957c0 6.6 5.4 12 12 12h96.969c6.6 0 12-5.4 12-12z"/></svg>
                </button>
            )}
            {currentTheme === 'light' && (
                <button
                    onClick={()=>setTheme('light')}
                    title={__('B&W Theme', 'pcm')}
                    className="fixed z-90 bottom-10 right-8 bg-gray-300 w-16 h-16 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-gray-500 hover:drop-shadow-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M37.213 17.73a13.213 13.213 0 1 0-20.707 10.866a4.006 4.006 0 0 1 1.665 3.315v4.731h11.658v-4.735a4.051 4.051 0 0 1 1.703-3.337a13.174 13.174 0 0 0 5.681-10.84ZM19.444 38.928h9.112m-9.178 2.286h9.113m-6.97 2.286h4.958"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M26.011 36.642v-7.059l1.649-3.498m-5.671 10.557v-7.059l-1.649-3.498"/></svg>
                </button>
            )}
        </>
    )
})
