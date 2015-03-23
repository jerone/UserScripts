// ==UserScript==
// @name        Github JSON Dependencies Linker
// @namespace   https://github.com/jerone/UserScripts
// @version     0.1.0
// @include     https://github.com/*/package.json
// @include     https://github.com/*/bower.json
// @grant       none
// @run-at      document-end
// ==/UserScript==

/* test cases:
 * https://github.com/jerone/PackageSize/blob/master/package.json
 * https://github.com/npm/npm/blob/448efd0eaa6f97af0889bf47efc543a1ea2f8d7e/test/tap/update-save/package.json
 * https://github.com/npm/npm/blob/448efd0eaa6f97af0889bf47efc543a1ea2f8d7e/test/disabled/bundlerecurs/package.json
 * https://github.com/npm/npm/blob/448efd0eaa6f97af0889bf47efc543a1ea2f8d7e/test/tap/outdated-new-versions/package.json
 * https://github.com/npm/npm/blob/448efd0eaa6f97af0889bf47efc543a1ea2f8d7e/test/tap/dev-dep-duplicate/package.json
 */

(function() {

	var blobElm = document.querySelector('.blob-wrapper'),
		blobLineElms = blobElm.querySelectorAll('.blob-code > span'),
		pkg = JSON.parse(blobElm.textContent),
		dependencyKeys = [
			'dependencies',
			'devDependencies',
			'peerDependencies',
			'bundleDependencies',
			'bundledDependencies',
			'optionalDependencies'
		],
		modules = [];

	// Get an unique list of all modules;
	dependencyKeys.forEach(function(dependencyKey) {
		var dependencies = pkg[dependencyKey] || {};
		Object.keys(dependencies).forEach(function(module) {
			if (modules.indexOf(module) === -1) {
				modules.push(module);
			}
		});
	});

	// Linkify all modules;
	modules.forEach(function(module) {
		var url = 'https://www.npmjs.org/package/' + module,
			moduleFilterText = '"' + module + '"';

		var moduleElms = Array.prototype.filter.call(blobLineElms, function(blobLineElm) {
			return blobLineElm.textContent.trim() === moduleFilterText;
		});

		// Modules could exist in multiple dependency lists;
		Array.prototype.forEach.call(moduleElms, function(moduleElm) {

			// Module names are textNodes;
			var moduleElmText = Array.prototype.find.call(moduleElm.childNodes, function(moduleElmChild) {
				return moduleElmChild.nodeType === 3;
			});

			var moduleElmLink = document.createElement('a');
			moduleElmLink.setAttribute('href', url);
			moduleElmLink.appendChild(document.createTextNode(module));

			// Replace textNode, so we remain surrounding highlighting (like the quotes);
			moduleElm.replaceChild(moduleElmLink, moduleElmText);
		});
	});

})();
