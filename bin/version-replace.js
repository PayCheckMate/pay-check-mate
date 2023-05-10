const fs      = require( 'fs' );
const replace = require( 'replace-in-file' );

const pluginFiles = [
	'includes/**/*',
	'wp-payroll.php',
];

const { version } = JSON.parse( fs.readFileSync( 'package.json' ) );

replace(
	{
		files: pluginFiles,
		from: /WP_PMS_SINCE/g,
		to: version,
	}
);
