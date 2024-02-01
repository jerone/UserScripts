// ==UserScript==
// @name             Github Pages Linker
// @id               Github_Pages_Linker@https://github.com/jerone/UserScripts
// @namespace        https://github.com/jerone/UserScripts/
// @description      Add a link to Github Pages (gh-pages) when available.
// @author           jerone
// @copyright        2014+, jerone (https://github.com/jerone)
// @license          CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license          GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @homepage         https://github.com/jerone/UserScripts/tree/master/Github_Pages_Linker
// @homepageURL      https://github.com/jerone/UserScripts/tree/master/Github_Pages_Linker
// @downloadURL      https://github.com/jerone/UserScripts/raw/master/Github_Pages_Linker/Github_Pages_Linker.user.js
// @updateURL        https://github.com/jerone/UserScripts/raw/master/Github_Pages_Linker/Github_Pages_Linker.user.js
// @supportURL       https://github.com/jerone/UserScripts/issues
// @contributionURL  https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @icon             https://github.githubassets.com/pinned-octocat.svg
// @version          1.2.5
// @grant            none
// @run-at           document-end
// @include          https://github.com/*
// ==/UserScript==

(function () {

	String.format = function (string) {
		var args = Array.prototype.slice.call(arguments, 1, arguments.length);
		return string.replace(/{(\d+)}/g, function (match, number) {
			return typeof args[number] !== "undefined" ? args[number] : match;
		});
	};

	function addLink() {
		if (document.getElementById("GithubPagesLinker")) {
			return;
		}

		var meta = document.querySelector('main h1');
		if (!meta) {
			return;
		}

		var branchSelector = document.querySelector('#branch-select-menu');
		if (!branchSelector) {
			return;
		}

		var branch = document.querySelector('.SelectMenu-item[href$="/tree/gh-pages"]');
		if (branch) {
			createLink(branch);
		} else {
			const observer = new MutationObserver(function () {
				var branch2 = document.querySelector('.SelectMenu-item[href$="/tree/gh-pages"]');
				if (branch2) {
					observer.disconnect();
					createLink(branch2);
				}
			});

			observer.observe(branchSelector, { subtree: true, childList: true });

			var dropdown = branchSelector.querySelector('ref-selector');
			window.setTimeout(function () {
				dropdown.dispatchEvent(new CustomEvent('container-mouseover', { bubbles: true }));
			}, 100);
		}

		function createLink(branch2) {
			var tree = branch2.getAttribute("href").split("/"); // `/{user}/{repo}/tree/gh-pages`;
			var url = String.format("{0}//{1}.github.io/{2}/", tree[0], tree[3], tree[4]);

			var div = document.createElement("small");
			div.id = "GithubPagesLinker";
			meta.parentNode.insertBefore(div, meta.nextSibling);

			var img = document.createElement("img");
			img.setAttribute("src", "https://github.githubassets.com/images/icons/emoji/octocat.png");
			img.setAttribute("align", "absmiddle");
			img.classList.add("emoji");
			img.style.height = "16px";
			img.style.width = "16px";
			div.appendChild(img);

			div.appendChild(document.createTextNode(" "));

			var a = document.createElement("a");
			a.setAttribute("href", "{https}://pages.github.com");
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
	}

	// Init;
	addLink();

	// On pjax;
	document.addEventListener('pjax:end', addLink);

})();
