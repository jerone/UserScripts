// ==UserScript==
// @name        Github Commit Diff
// @namespace   https://github.com/jerone/UserScripts
// @description Adds button to show diff (or patch) file for commit
// @author      jerone
// @homepage    https://github.com/jerone/UserScripts/tree/master/Github_Commit_Diff
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Github_Commit_Diff
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Github_Commit_Diff/Github_Commit_Diff.user.js
// @include     https://github.com/*
// @version     1.1
// @grant       none
// ==/UserScript==

(function() {

	function addButton() {
		var e;
		if (!/\/commit\//.test(location.href) || !(e = document.querySelector(".explain"))) return;

		var r = e.querySelector(".GithubCommitWhitespaceButton");
		if (r) r.parentElement.removeChild(r);

		function getPatchOrDiffHref(type) {
			return (document.querySelector("link[type='text/plain+" + type + "']")
				|| { href: location.href + "." + type }).href;
		};

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

		a.addEventListener("click", function(e) {
			if (e.shiftKey) {
				e.preventDefault();
				location.href = getPatchOrDiffHref("patch");
			}
		}, false);
	}

	// init;
	addButton();

	// on pjax;
	$(document).on('pjax:success', addButton);

})();