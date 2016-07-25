// ==UserScript==
// @name        Github Pull Request From Link
// @namespace   https://github.com/jerone/UserScripts/
// @description Make pull request branches linkable
// @author      jerone
// @copyright   2014+, jerone (http://jeroenvanwarmerdam.nl)
// @license     GNU GPLv3
// @homepage    https://github.com/jerone/UserScripts/tree/master/Github_Pull_Request_From
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Github_Pull_Request_From
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Github_Pull_Request_From/Github_Pull_Request_From.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Github_Pull_Request_From/Github_Pull_Request_From.user.js
// @supportURL  https://github.com/jerone/UserScripts/issues
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @version     17
// @grant       none
// @include     https://github.com/*/*
// ==/UserScript==

(function() {

	String.format = function(string) {
		var args = Array.prototype.slice.call(arguments, 1, arguments.length);
		return string.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] !== "undefined" ? args[number] : match;
		});
	};

	function init() {
		var repo = document.querySelector('.repohead-details-container h1 [itemprop="name"]').textContent,
			author = document.querySelector('.repohead-details-container h1 [itemprop="author"]').textContent;
		Array.prototype.filter.call(document.querySelectorAll("span.commit-ref"), function(treeSpan) {
			return !treeSpan.querySelector(".unknown-repo");
		}).forEach(function(treeSpan) {
			var treeUser = treeSpan.querySelector('.user');
			var treeParts = treeSpan.querySelectorAll('.css-truncate-target');
			var treeLink = document.createElement("a");
			Array.prototype.forEach.call(treeParts, function(part) {
				part.style.display = "inline";
			});
			treeLink.setAttribute("href", String.format("https://github.com/{0}/{1}/tree/{2}",
				treeUser ? treeUser.textContent : author, // user;
				repo, // repository;
				escape(treeParts[treeParts.length - 1].textContent))); // branch;
			treeLink.innerHTML = treeSpan.innerHTML;
			treeSpan.innerHTML = "";
			treeSpan.appendChild(treeLink);
		});
	}

	// Page load;
	init();

	// On pjax;
	document.addEventListener('pjax:end', init);

})();
