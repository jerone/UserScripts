// ==UserScript==
// @id          Github_Pages_Linker@https://github.com/jerone/UserScripts
// @name        Github Pages Linker
// @namespace   https://github.com/jerone/UserScripts/
// @description Add a link to Github Pages (gh-pages) when available.
// @author      jerone
// @copyright   2014+, jerone (http://jeroenvanwarmerdam.nl)
// @license     GNU GPLv3
// @homepage    https://github.com/jerone/UserScripts/tree/master/Github_Pages_Linker
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Github_Pages_Linker
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Github_Pages_Linker/Github_Pages_Linker.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Github_Pages_Linker/Github_Pages_Linker.user.js
// @supportURL  https://github.com/jerone/UserScripts/issues
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @version     1.1
// @grant       none
// @run-at      document-end
// @include     https://github.com/*
// ==/UserScript==
/* global unsafeWindow */

(function() {

	String.format = function(string) {
		var args = Array.prototype.slice.call(arguments, 1, arguments.length);
		return string.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] !== "undefined" ? args[number] : match;
		});
	};

	function addLink() {
		var meta = document.querySelector(".repository-meta");
		if (!meta) {
			return;
		}

		var branch = document.querySelector(".js-navigation-open[data-name='gh-pages']");
		if (!branch) {
			return;
		}

		var tree = branch.getAttribute("href").split("/"); // `/{user}/{repo}/tree/gh-pages`;
		var url = String.format("https://{0}.github.io/{1}", tree[1], tree[2]);

		var div = document.createElement("div");
		div.classList.add('GithubPagesLinker');
		div.style.margin = "-10px 0px 10px";
		meta.parentNode.insertBefore(div, meta.nextSibling);

		var img = document.createElement("img");
		img.setAttribute("src", "https://assets-cdn.github.com/images/icons/emoji/octocat.png");
		img.setAttribute("align", "absmiddle");
		img.classList.add("emoji");
		img.style.height = "16px";
		img.style.width = "16px";
		div.appendChild(img);

		div.appendChild(document.createTextNode(" "));

		var a = document.createElement("a");
		a.setAttribute("href", "https://pages.github.com");
		a.setAttribute("title", "More info about gh-pages...");
		a.style.color = "inherit";
		a.appendChild(document.createTextNode("Github Pages"));
		div.appendChild(a);

		div.appendChild(document.createTextNode(": "));

		var aa = document.createElement("a");
		aa.setAttribute("href", url);
		aa.appendChild(document.createTextNode(url));
		div.appendChild(aa);
	}

	// Page load;
	console.log('GithubPagesLinker', 'page load');
	addLink();

	// On pjax;
	unsafeWindow.$(document).on("pjax:end", function() {
		console.log('GithubPagesLinker', 'pjax');
		addLink();
	});

})();
