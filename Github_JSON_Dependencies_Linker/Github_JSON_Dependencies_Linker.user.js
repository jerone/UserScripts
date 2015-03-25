// ==UserScript==
// @name        Github JSON Dependencies Linker
// @namespace   https://github.com/jerone/UserScripts
// @version     0.1.0
// @include     https://github.com/*/package.json
// @include     https://github.com/*/bower.json
// @include     https://github.com/*/project.json
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// ==/UserScript==

/* test cases:
 * https://github.com/jerone/PackageSize/blob/master/package.json <!-- multiple package.json dependencies;
 * https://github.com/npm/npm/blob/master/test/disabled/bundlerecurs/package.json
 * https://github.com/npm/npm/blob/master/test/tap/dev-dep-duplicate/package.json <-- duplicate packages;
 * https://github.com/npm/npm/blob/master/test/packages/npm-test-optional-deps/package.json <-- optionalDependencies & different semver;
 * https://github.com/npm/npm/blob/master/test/packages/npm-test-bundled-git/package.json <-- git semver & bundledDependencies;
 * https://github.com/npm/npm/blob/master/test/packages/npm-test-shrinkwrap/npm-shrinkwrap.json <-- npm-shrinkwrap.json;
 * https://github.com/npm/npm/blob/master/test/packages/npm-test-url-dep/package.json <-- url semver;
 * https://github.com/npm/npm/blob/master/test/tap/install-from-local/package-with-scoped-paths/package.json <-- scoped paths;
 * https://github.com/aspnet/MusicStore/blob/master/src/MusicStore.Spa/project.json <-- ASP.NET project.json with COMMENTS;
 */

(function() {

	var isNPM = location.pathname.endsWith('/package.json'),
		isBower = location.pathname.endsWith('/bower.json'),
		isNuGet = location.pathname.endsWith('/project.json'),
		blobElm = document.querySelector('.blob-wrapper'),
		blobLineElms = blobElm.querySelectorAll('.blob-code > span'),
		pkg = (function() {
			// JSON parser could fail on JSON with comments;
			try {
				return JSON.parse(blobElm.textContent);
			} catch (ex) {
				// https://github.com/sindresorhus/strip-json-comments
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
					// Strip out comments from the JSON and try again;
				return JSON.parse(stripJsonComments(blobElm.textContent));
			}
		})(),
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

	// Get url depending on json type;
	var getUrl = (function() {
		if (isNPM) {
			return function(module) {
				var url = 'https://www.npmjs.org/package/' + module;
				linkify(module, url);
			};
		} else if (isBower) {
			return function(module) {
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
			};
		} else if (isNuGet) {
			return function(module) {
				var url = 'https://www.nuget.org/packages/' + module;
				linkify(module, url);
			};
		}
	})();

	// Linkify module;
	function linkify(module, url) {
		var moduleFilterText = '"' + module + '"';

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
	}

	modules.forEach(function(module) {
		getUrl(module);
	});

})();
