// ==UserScript==
// @name        Github Pull Request From Link
// @namespace   https://github.com/jerone/UserScripts/
// @description Make pull request branches linkable
// @author      jerone
// @copyright   2014+, jerone (http://jeroenvanwarmerdam.nl)
// @license     CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license     GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @homepage    https://github.com/jerone/UserScripts/tree/master/Github_Pull_Request_From
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Github_Pull_Request_From
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Github_Pull_Request_From/Github_Pull_Request_From.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Github_Pull_Request_From/Github_Pull_Request_From.user.js
// @supportURL  https://github.com/jerone/UserScripts/issues
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @icon        https://assets-cdn.github.com/pinned-octocat.svg
// @version     19.1
// @grant       none
// @include     https://github.com/*/*
// @exclude     https://github.com/*/*.diff
// @exclude     https://github.com/*/*.patch
// ==/UserScript==

(function () {

	String.format = function (string) {
		var args = Array.prototype.slice.call(arguments, 1, arguments.length);
		return string.replace(/{(\d+)}/g, function (match, number) {
			return typeof args[number] !== "undefined" ? args[number] : match;
		});
	};

	function init() {
		if (!document.querySelector('.repohead-details-container h1 [itemprop="name"]')) return;

		var repo = document.querySelector('.repohead-details-container h1 [itemprop="name"]').textContent,
			author = document.querySelector('.repohead-details-container h1 [itemprop="author"]').textContent;
		Array.prototype.filter.call(document.querySelectorAll("span.commit-ref"), function (treeSpan) {
			return !treeSpan.querySelector(".unknown-repo");
		}).forEach(function (treeSpan) {
			var treeUser = treeSpan.querySelector('.user');
			var treeParts = treeSpan.querySelectorAll('.css-truncate-target');
			var treeLink = document.createElement("a");
			Array.prototype.forEach.call(treeParts, function (part) {
				part.style.display = "inline";
			});
			treeLink.setAttribute("href", String.format("/{0}/{1}/tree/{2}",
				treeUser ? treeUser.textContent : author, // user
				repo, // repository
				escape(treeParts[treeParts.length - 1].textContent))); // branch
			treeLink.innerHTML = treeSpan.innerHTML;
			treeSpan.innerHTML = "";
			treeSpan.appendChild(treeLink);
		});
	}

	// Page load.
	init();

	// On pjax.
	document.addEventListener('pjax:end', init);

})();
