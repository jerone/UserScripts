module.exports = {
	env: {
		browser: true,
		greasemonkey: true,
		es2021: true,
	},
	overrides: [
		{
			env: {
				node: true,
			},
			files: [".eslintrc.{js,cjs}"],
			parserOptions: {
				sourceType: "script",
			},
		},
		{
			files: ["*.user.js"],
			extends: ["plugin:userscripts/recommended"],
			rules: {
				"userscripts/align-attributes": ["error", 1],
				"userscripts/no-invalid-headers": ["error", { allowed: ["id", "browser"] }],
				"userscripts/compat-headers": "off",
			},
			settings: {
				userscriptVersions: {
					tampermonkey: ">=4",
					violentmonkey: ">=2",
					greasemonkey: "*",
				},
			},
		},
	],
	parserOptions: {
		ecmaVersion: "latest",
	},
	rules: {},
};

