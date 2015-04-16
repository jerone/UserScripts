// ==UserScript==
// @id          Github_JSON_Dependencies_Linker@https://github.com/jerone/UserScripts
// @name        Github JSON Dependencies Linker
// @namespace   https://github.com/jerone/UserScripts
// @description Linkify all dependencies found in an JSON file.
// @author      jerone
// @copyright   2015+, jerone (http://jeroenvanwarmerdam.nl)
// @license     GNU GPLv3
// @homepage    https://github.com/jerone/UserScripts/tree/master/Github_JSON_Dependencies_Linker
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Github_JSON_Dependencies_Linker
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Github_JSON_Dependencies_Linker/Github_JSON_Dependencies_Linker.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Github_JSON_Dependencies_Linker/Github_JSON_Dependencies_Linker.user.js
// @supportURL  https://github.com/jerone/UserScripts/issues
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @version     0.3.0
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @include     https://github.com/*/package.json
// @include     https://github.com/*/npm-shrinkwrap.json
// @include     https://github.com/*/bower.json
// @include     https://github.com/*/project.json
// ==/UserScript==
/* global GM_xmlhttpRequest */

(function() {

	var blobElm = document.querySelector('.blob-wrapper'),
		blobLineElms = blobElm.querySelectorAll('.blob-code > span'),
		pkg = (function() {
			try {
				// JSON parser could fail on JSON with comments;
				return JSON.parse(blobElm.textContent);
			} catch (ex) {
				// Strip out comments from the JSON and try again;
				return JSON.parse(stripJsonComments(blobElm.textContent));
			}
		})(),
		isNPM = location.pathname.endsWith('/package.json') || location.pathname.endsWith('/npm-shrinkwrap.json'),
		isBower = location.pathname.endsWith('/bower.json'),
		isNuGet = location.pathname.endsWith('/project.json'),
		isAtom = (function() {
			if (location.pathname.endsWith('/package.json')) {
				if (pkg.atomShellVersion) {
					return true;
				} else if (pkg.engines && pkg.engines.atom) {
					return true;
				}
			}
			return false;
		})(),
		dependencyKeys = [
			'dependencies',
			'devDependencies',
			'peerDependencies',
			'bundleDependencies',
			'bundledDependencies',
			'packageDependencies',
			'optionalDependencies'
		],
		modules = (function() {
			var _modules = {};
			dependencyKeys.forEach(function(dependencyKey) {
				_modules[dependencyKey] = [];
			});
			return _modules;
		})();

	// Get an unique list of all modules;
	function fetchModules(root) {
		dependencyKeys.forEach(function(dependencyKey) {
			var dependencies = root[dependencyKey] || {};
			Object.keys(dependencies).forEach(function(module) {
				if (modules[dependencyKey].indexOf(module) === -1) {
					modules[dependencyKey].push(module);
				}
				fetchModules(dependencies[module]);
			});
		});
	}
	fetchModules(pkg);

	// Linkify module;
	function linkify(module, url) {
		// Try to find the module; could be mulitple locations;
		var moduleFilterText = '"' + module + '"';
		var moduleElms = Array.prototype.filter.call(blobLineElms, function(blobLineElm) {
			if (blobLineElm.textContent.trim() === moduleFilterText) {
				// Module name preceding a colon is never a key;
				var prev = blobLineElm.previousSibling;
				return !(prev && prev.textContent.trim() === ':');
			}
			return false;
		});

		// Modules could exist in multiple dependency lists;
		Array.prototype.forEach.call(moduleElms, function(moduleElm) {

			// Module names are textNodes on Github;
			var moduleElmText = Array.prototype.find.call(moduleElm.childNodes, function(moduleElmChild) {
				return moduleElmChild.nodeType === 3;
			});

			var moduleElmLink = document.createElement('a');
			moduleElmLink.setAttribute('href', url);
			moduleElmLink.appendChild(document.createTextNode(module));

			// Replace textNode, so we keep surrounding elements (like the highlighted quotes);
			moduleElm.replaceChild(moduleElmLink, moduleElmText);
		});
	}

	/*!
		strip-json-comments
		Strip comments from JSON. Lets you use comments in your JSON files!
		https://github.com/sindresorhus/strip-json-comments
		by Sindre Sorhus
		MIT License
	*/
	function stripJsonComments(str) {
		var currentChar;
		var nextChar;
		var insideString = false;
		var insideComment = false;
		var ret = '';
		for (var i = 0; i < str.length; i++) {
			currentChar = str[i];
			nextChar = str[i + 1];
			if (!insideComment && str[i - 1] !== '\\' && currentChar === '"') {
				insideString = !insideString;
			}
			if (insideString) {
				ret += currentChar;
				continue;
			}
			if (!insideComment && currentChar + nextChar === '//') {
				insideComment = 'single';
				i++;
			} else if (insideComment === 'single' && currentChar + nextChar === '\r\n') {
				insideComment = false;
				i++;
				ret += currentChar;
				ret += nextChar;
				continue;
			} else if (insideComment === 'single' && currentChar === '\n') {
				insideComment = false;
			} else if (!insideComment && currentChar + nextChar === '/*') {
				insideComment = 'multi';
				i++;
				continue;
			} else if (insideComment === 'multi' && currentChar + nextChar === '*/') {
				insideComment = false;
				i++;
				continue;
			}
			if (insideComment) {
				continue;
			}
			ret += currentChar;
		}
		return ret;
	}

	// Init;
	Object.keys(modules).forEach(function(dependencyKey) {
		modules[dependencyKey].forEach(function(module) {
			if (isAtom && dependencyKey === 'packageDependencies') { // Atom needs to be before NPM;
				var url = 'https://atom.io/packages/' + module;
				linkify(module, url);
			} else if (isNPM) {
				var url = 'https://www.npmjs.org/package/' + module;
				linkify(module, url);
			} else if (isBower) {
				GM_xmlhttpRequest({
					method: 'GET',
					url: 'http://bower.herokuapp.com/packages/' + module,
					onload: function(response) {
						var data = JSON.parse(response.responseText);
						var re = /github\.com\/([\w\-\.]+)\/([\w\-\.]+)/i;
						var parsedUrl = re.exec(data.url.replace(/\.git$/, ''));
						if (parsedUrl) {
							var user = parsedUrl[1];
							var repo = parsedUrl[2];
							var url = 'https://github.com/' + user + '/' + repo;
							linkify(module, url);
						} else {
							linkify(module, data.url);
						}
					}
				});
			} else if (isNuGet) {
				var url = 'https://www.nuget.org/packages/' + module;
				linkify(module, url);
			}
		});
	});

})();
