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
