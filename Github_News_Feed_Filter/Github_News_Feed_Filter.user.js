// ==UserScript==
// @name        Github News Feed Filter
// @namespace   https://github.com/jerone/UserScripts
// @description Add filters for Github homepage news feed items
// @author      jerone
// @homepage    https://github.com/jerone/UserScripts/tree/master/Github_News_Feed_Filter
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Github_News_Feed_Filter
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Github_News_Feed_Filter/Github_News_Feed_Filter.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Github_News_Feed_Filter/Github_News_Feed_Filter.user.js
// @include     http*://github.com/
// @version     1
// @grant       none
// ==/UserScript==

(function () {

	function proxy(fn) {
		return function () {
			var that = this;
			return function (e) {
				var args = that.slice(0);  // clone;
				args.unshift(e);  // prepend event;
				fn.apply(this, args);
			};
		}.call([].slice.call(arguments, 1));
	}

	function addFilters() {
		var container;
		if (!(container = document.querySelector(".news"))) return;

		var ul = document.createElement("ul");
		ul.classList.add("dashboard-tabs");
		[{ text: "", icon: "octicon-comment-discussion", filter: ["*"] },
		 { text: "Comments", icon: "octicon-comment", filter: ["issues_comment"] },
		 { text: "Commits", icon: "octicon-git-commit", filter: ["push"] },
		 { text: "Issue actions", icon: "octicon-issue-opened", filter: ["issues_opened", "issues_closed"] }
		].forEach(function (item) {
			var li = document.createElement("li");
			var a = document.createElement("a");
			a.classList.add("js-selected-navigation-item");
			a.setAttribute("href", "/");
			a.setAttribute("title", item.filter.join(" & "));
			var s = document.createElement("span");
			s.classList.add("octicon", item.icon);
			if (item.filter == "*") {
				li.style.cssFloat = "left";
				li.style.width = "49px";
				a.classList.add("selected");
			} else {
				s.style.marginRight = "6px";
			}
			a.appendChild(s);
			a.appendChild(document.createTextNode(item.text));
			a.addEventListener("click", proxy(function (e, filter) {
				e.preventDefault();
				Array.forEach(container.querySelectorAll(".selected"), function (m) {
					m.classList.remove("selected");
				});
				this.classList.add("selected");
				var alerts = container.querySelectorAll(".alert");
				Array.filter(alerts, function (alert) {
					alert.style.display = filter == "*" || filter.some(function (c) {
						return alert.classList.contains(c);
					}) ? "block" : "none";
				});
				return false;
			}, item.filter));
			li.appendChild(a);
			ul.appendChild(li);
		});

		container.insertBefore(ul, container.firstChild);

		// update on clicking "More"-button;
		var event = new Event("click");
		$.pageUpdate(function () {
			window.setTimeout(function () {
				container.querySelector(".selected").dispatchEvent(event);
			}, 1);
		});
	}

	// init;
	addFilters();

	// on pjax;
	$(document).on('pjax:success', addFilters);

})();