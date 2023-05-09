<?php
/**
 * Plugin Name:         WP Payroll
 * Plugin URI:          https://github.com/RatulHasan/wp-payroll
 * Description:         WP-Payroll is a powerful and user-friendly payroll management solution that simplifies the payroll process for businesses of all sizes. It provides a comprehensive set of features that enables users to manage payroll efficiently and accurately, saving time and minimizing errors.
 * Version:             1.0.0
 * Requires PHP:        7.4
 * Requires at least:   5.6
 * Author:              Ratul Hasan
 * Author URI:          https://ratuljh.wordpress.com/
 * License:             GPL-3.0-or-later
 * License URI:         https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:         wp-payroll
 * Domain Path:         /languages
 *
 * @package WordPress
 */

// To prevent direct access, if not define WordPress ABSOLUTE PATH then exit.
if (! defined('ABSPATH')) {
    exit();
}

require 'vendor/autoload.php';