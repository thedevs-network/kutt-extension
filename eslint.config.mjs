import nodeConfig from '@abhijithvijayan/eslint-config/node';
import tsConfig from '@abhijithvijayan/eslint-config/typescript';
import reactConfig from '@abhijithvijayan/eslint-config/react';

export default [
	{
		ignores: [
			'node_modules/**',
			'dist/**',
			'extension/**',
			'.yarn/**',
			'.pnp.js',
			'*.js',
			'*.mjs',
			'vite.config.ts',
		],
	},
	...nodeConfig({
		files: ['**/*.ts', '**/*.tsx'],
	}),
	...tsConfig({
		files: ['**/*.ts', '**/*.tsx'],
	}),
	...reactConfig({
		files: ['**/*.tsx'],
	}),
	{
		files: ['**/*.ts', '**/*.tsx'],
		rules: {
			'no-console': 'off',
			'@typescript-eslint/no-use-before-define': 'warn',
			'@typescript-eslint/no-explicit-any': 'warn',
			// Disable due to resolver issues in ESM
			'import-x/no-duplicates': 'off',
			// Browser extension code uses browser APIs, not Node.js
			'n/no-unsupported-features/node-builtins': 'off',
		},
	},
	{
		files: ['**/*.tsx'],
		rules: {
			'react/jsx-props-no-spreading': 'off',
			'react/react-in-jsx-scope': 'off',
			'react/no-array-index-key': 'warn',
			'jsx-a11y/label-has-associated-control': 'off',
		},
	},
];
