// ==UserScript==
// @name        Github Commit Diff
// @namespace   https://github.com/jerone/UserScripts
// @description Adds button to show diff (or patch) file for commit
// @author      jerone
// @homepage    https://github.com/jerone/UserScripts/tree/master/Github_Commit_Diff
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Github_Commit_Diff
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Github_Commit_Diff/Github_Commit_Diff.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Github_Commit_Diff/Github_Commit_Diff.user.js
// @include     https://github.com/*
// @version     1.4
// @grant       none
// ==/UserScript==
/* global unsafeWindow */

(function() {

	function addButton() {
		var e;
		if (!(/\/commit\//.test(location.href) || /\/compare\//.test(location.href) || /\/pull\/\d*\/files/.test(location.href)) ||
			!(e = document.querySelector("#toc .explain"))) { return; }

		var r = e.querySelector(".GithubCommitDiffButton");
		if (r) { r.parentElement.removeChild(r); }

		function getPatchOrDiffHref(type) {
			return (document.querySelector("link[type='text/plain+" + type + "']")
				 || document.querySelector("link[type='text/x-" + type + "']")
				 || { href: location.href + "." + type }).href;
		}

		var b = e.querySelector(".minibutton");

		var s = document.createElement("span");
		s.textContent = " ";
		s.classList.add("octicon", "octicon-diff");
		s.style.color = "#333";  // set color because of css selector `p.explain .octicon`;

		var a = document.createElement("a");
		a.classList.add("GithubCommitDiffButton", "minibutton", "tooltipped", "tooltipped-s");
		a.setAttribute("href", getPatchOrDiffHref("diff"));
		a.setAttribute("title", "Show commit diff.\r\nHold Shift to open commit patch.");
		a.setAttribute("rel", "nofollow");
		a.setAttribute("aria-label", a.getAttribute("title"));
		a.style.marginLeft = "10px";  // give us some room;
		a.appendChild(s);
		a.appendChild(document.createTextNode("Diff"));

		b.parentNode.insertBefore(a, b);

		a.addEventListener("mousedown", function(e) {
			if (e.shiftKey) {
				var patch = getPatchOrDiffHref("patch");
				e.preventDefault();
				a.setAttribute("href", patch);
				if (e.which === 1) {  // left click;
					location.href = patch;
					// To prevent Firefox default behavior (opening a new window)
					//  when pressing shift-click on a link, delete the link.
					this.parentElement.removeChild(this);
				} else if (e.which === 2) {  // middle click;
					window.open(patch, "GithubCommitDiff");
				}
			} else {
				a.setAttribute("href", getPatchOrDiffHref("diff"));
			}
		}, false);
		a.addEventListener("mouseout", function() {
			a.setAttribute("href", getPatchOrDiffHref("diff"));
		}, false);
	}

	// init;
	addButton();

	// on pjax;
	unsafeWindow.$(document).on('pjax:success', addButton);

	// on PR files tab;
	var f;
	if ((f = document.querySelector(".js-pull-request-tab[data-container-id='files_bucket']"))) {
		f.addEventListener("click", function() {
			window.setTimeout(addButton, 13);
		});
	}

})();