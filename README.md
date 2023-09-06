Pay Check Mate
--------------------
Pay Check Mate is a powerful and user-friendly payroll management solution that simplifies the payroll process for businesses of all sizes. It provides a comprehensive set of features that enables users to manage payroll efficiently and accurately, saving time and minimizing errors.

## Development
To start development, you need to install the dependencies and run the development server.
1. Install composer dependencies
```bash
composer install
```
2. Install npm dependencies
```bash
npm install
```
3. Run the development server
```bash
npm run start
```
4. To hot reload the development server
```bash
npm run start:hot
```
For hot reloading to work, you need to set WP_DEBUG to true in wp-config.php
```php
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', true );
define( 'SCRIPT_DEBUG', true );
```

## PhpStan
```bash
vendor/bin/phpstan analyse --level=6 includes
```

https://phpstan.org/user-guide/rule-levels
