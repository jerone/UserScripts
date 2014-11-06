// ==UserScript==
// @name        Github Commit Whitespace
// @namespace   https://github.com/jerone/UserScripts
// @description Adds button to hide whitespaces from commit
// @author      jerone
// @copyright   2014+, jerone (http://jeroenvanwarmerdam.nl)
// @license     GNU GPLv3
// @homepage    https://github.com/jerone/UserScripts/tree/master/Github_Commit_Whitespace
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Github_Commit_Whitespace
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Github_Commit_Whitespace/Github_Commit_Whitespace.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Github_Commit_Whitespace/Github_Commit_Whitespace.user.js
// @supportURL  https://github.com/jerone/UserScripts/issues
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @include     https://github.com/*
// @version     1.4.1
// @grant       none
// ==/UserScript==
/* global unsafeWindow */

(function() {

	function addButton() {
		var e;
		if (!(/\/commit\//.test(location.href) || /\/compare\//.test(location.href) || /\/pull\/\d*\/files/.test(location.href)) ||
			!(e = document.getElementById("toc"))) { return; }

		var r = e.querySelector(".GithubCommitWhitespaceButton");
		if (r) { r.parentElement.removeChild(r); }

		var on = /w=/.test(location.search);  // any occurense results in enabling;

		var b = e.querySelector(".toc-diff-stats");

		var s = document.createElement("span");
		s.textContent = " \u2423";
		s.style.color = "#333";  // set color because of css selector `p.explain .octicon`;

		var a = document.createElement("a");
		a.classList.add("minibutton", "tooltipped", "tooltipped-n");
		if (on) { a.classList.add("selected"); }
		a.setAttribute("href", url(on));
		a.setAttribute("rel", "nofollow");
		a.setAttribute("aria-label", on ? "Show commit whitespace" : "Hide commit whitespaces");
		a.appendChild(s);

		var g = document.createElement("div");
		g.classList.add("GithubCommitWhitespaceButton", "button-group", "right");
		g.style.margin = "0 10px 0 0";  // give us some room;
		g.appendChild(a);

		b.parentNode.insertBefore(g, b);
	}

	function url(on) {
		var searches = location.search.replace(/^\?/, "").split("&").filter(function(item) {
			return item && !/w=.*/.test(item);
		});
		if (!on) {
			searches.push("w=1");
		}
		return location.href.replace(location.search, "")
			+ (searches.length > 0 ? "?" + searches.join("&") : "");
	}

	// init;
	addButton();

	// on pjax;
	unsafeWindow.$(document).on("pjax:end", addButton);  // `pjax:end` also runs on history back;

	// on PR files tab;
	var f;
	if ((f = document.querySelector(".js-pull-request-tab[data-container-id='files_bucket']"))) {
		f.addEventListener("click", function() {
			window.setTimeout(addButton, 13);
		});
	}

})();
