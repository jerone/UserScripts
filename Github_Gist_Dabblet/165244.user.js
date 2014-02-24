// ==UserScript==
// @name        Github Gist Dabblet
// @namespace   https://github.com/jerone/UserScripts/tree/master/Github_Gist_Dabblet
// @description Share your GitHub Gist to Dabblet.
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Github_Gist_Dabblet/165244.user.js
// @include     *://gist.github.com/*
// @version     3.2
// ==/UserScript==

/*
 * The following urls should be converted to Dabblet:
 *
 *  - https://gist.github.com/jerone/3810309
 *                                   ¯¯¯¯¯¯¯
 *  - https://gist.github.com/jerone/3810309/revisions
 *                                   ¯¯¯¯¯¯¯
 *  - https://gist.github.com/jerone/3810309/forks
 *                                   ¯¯¯¯¯¯¯
 *  - https://gist.github.com/jerone/3810309/stars
 *                                   ¯¯¯¯¯¯¯
 *  - https://gist.github.com/jerone/3810309/f2815cc6796ea985f74b8f5f3c717e8de3b12d37
 *                                   ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯
 *  - https://gist.github.com/3810309/f2815cc6796ea985f74b8f5f3c717e8de3b12d37
 *                            ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯
 */

String.format = function (string) {
	var args = Array.prototype.slice.call(arguments, 1, arguments.length);
	return string.replace(/{(\d+)}/g, function (match, number) {
		return typeof args[number] != "undefined" ? args[number] : match;
	});
};

function addMenuItem() {
	var link, linkLong, url, menu, li, user;

	if (document.getElementById("Github_Gist_Share_Dabblet")) return;  // already defined in Github Gist Share (http://userscripts.org/scripts/show/157850);

	if ((link = document.querySelector("[name='link-field']")) && (menu = document.querySelector('ul.menu.gisttabs'))) {  // check if we're on an actual gists;
		user = document.querySelector(".author.vcard").textContent.trim();
		if ((linkLong = document.querySelector(".site-container.js-site-container")) && linkLong.dataset.url) {
			var linkLongParts = linkLong.dataset.url.split("/");
			linkLongParts.shift();
			if (/^(?:revisions|forks|stars)$/gi.test(linkLongParts[linkLongParts.length - 1])) {
				linkLongParts.pop();
			}
			if (new RegExp(user,"gi").test(linkLongParts[0])) {
				linkLongParts.shift();
			}
			url = "/" + linkLongParts.join("/");
		} else {
			url = link.value.replace(new RegExp("https?:\/\/gist\.github\.com/" + user, "gi"), "");
		}

		url = "http://dabblet.com/gist" + url;

		menu.appendChild(li = document.createElement("li"));
		li.id = "Github_Gist_Dabblet";

		var key = "Dabblet",
			dabbletA = document.createElement("a"),
			dabbletImg = document.createElement("img");
		li.appendChild(dabbletA);
		dabbletA.appendChild(dabbletImg);
		dabbletA.href = url;
		dabbletA.title = String.format("[{0}] {1}", key, dabbletA.href);
		dabbletA.style.display = "inline-block";
		dabbletA.target = "_blank";
		dabbletImg.src = "http://dabblet.com/favicon.ico";
		dabbletImg.alt = key;
	}
}

// init;
addMenuItem();

// on pjax;
$(document).on("pjax:success", addMenuItem);