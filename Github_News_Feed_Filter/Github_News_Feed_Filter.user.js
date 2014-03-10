// ==UserScript==
// @name        Github News Feed Filter
// @namespace   https://github.com/jerone/UserScripts
// @description Add filters for Github homepage news feed items
// @author      jerone
// @homepage    https://github.com/jerone/UserScripts/tree/master/Github_News_Feed_Filter
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Github_News_Feed_Filter
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Github_News_Feed_Filter/Github_News_Feed_Filter.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Github_News_Feed_Filter/Github_News_Feed_Filter.user.js
// @include     https://github.com/
// @version     3.0
// @grant       none
// ==/UserScript==

(function() {

	function proxy(fn) {
		return function() {
			var that = this;
			return function(e) {
				var args = that.slice(0);  // clone;
				args.unshift(e);  // prepend event;
				fn.apply(this, args);
			};
		}.call([].slice.call(arguments, 1));
	}

	function addFilters() {
		var container = document.querySelector(".news");
		if (!container) return;

		var ul = document.createElement("ul");
		ul.classList.add("dashboard-tabs");
		container.insertBefore(ul, container.firstChild);
		[{ text: "", icon: "octicon-comment-discussion", filter: ["*"] },
		 { text: "Commits", icon: "octicon-git-commit", filter: ["push"] },
		 { text: "Pull Requests", icon: "octicon-git-pull-request", filter: ["pull_request"] },
		 { text: "Issues", icon: "octicon-issue-opened", filter: ["issues_opened", "issues_comment", "issues_closed", "issues_reopened"] },
		 { text: "Stars", icon: "octicon-star", filter: ["watch_started"] },
		 { text: "Repo", icon: "octicon-repo", filter: ["create"] },
		 { text: "Wiki", icon: "octicon-book", filter: ["gollum"] }
		].forEach(function(item) {
			var li = document.createElement("li");
			var a = document.createElement("a");
			a.classList.add("js-selected-navigation-item");
			a.setAttribute("href", "/");
			a.setAttribute("title", item.filter.join(" & "));
			a.style.lineHeight = "28px";
			var s = document.createElement("span");
			s.classList.add("octicon", item.icon);
			if (item.filter == "*") {
				li.style.cssFloat = "left";
				li.style.width = "34px";
				a.classList.add("selected");
			} else {
				s.style.marginRight = "6px";
			}
			a.appendChild(s);
			a.appendChild(document.createTextNode(item.text));
			a.addEventListener("click", proxy(function(e, filter) {
				e.preventDefault();
				var alerts = container.querySelectorAll(".alert");
				Array.forEach(alerts, function(alert) {
					if (alert.getElementsByClassName("octicon-git-pull-request").length > 0) {
						alert.classList.remove("issues_opened", "issues_closed");
						alert.classList.add("pull_request");
					}
				});
				Array.forEach(container.querySelectorAll(".selected"), function(m) {
					m.classList.remove("selected");
				});
				this.classList.add("selected");
				Array.filter(alerts, function(alert) {
					alert.style.display = filter == "*" || filter.some(function(c) {
						return alert.classList.contains(c);
					}) ? "block" : "none";
				});
				return false;
			}, item.filter));
			li.appendChild(a);
			ul.appendChild(li);
		});

		// update on clicking "More"-button;
		$.pageUpdate(function() {
			window.setTimeout(function() {
				container.querySelector(".selected").dispatchEvent(new Event("click"));
			}, 1);
		});
	}

	// init;
	addFilters();

	// on pjax;
	$(document).on('pjax:success', addFilters);

})();