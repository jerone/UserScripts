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
			rules: {},
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
