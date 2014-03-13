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
// @version     4
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

	var filters = [
		{ text: "All News Feed", icon: "octicon-comment-discussion", classNames: ["*"] },
		{ text: "Commits", icon: "octicon-git-commit", classNames: ["push"] },
		{ text: "Pull Requests", icon: "octicon-git-pull-request", classNames: ["pull_request", "pull_request_comment"] },
		{ text: "Issues", icon: "octicon-issue-opened", classNames: ["issues_opened", "issues_comment", "issues_closed", "issues_reopened"] },
		{ text: "Stars", icon: "octicon-star", classNames: ["watch_started"] },
		{ text: "Repo", icon: "octicon-repo", classNames: ["create", "public", "release"] },
		{ text: "Wiki", icon: "octicon-book", classNames: ["gollum"] },
		{ text: "Gist", icon: "octicon-gist", classNames: ["gist"] }
		// Pissible other classes: commit_comment & follow & fork & member_add
	];

	function addFilters() {
		var container = document.querySelector(".news");
		if (!container) return;

		var sidebar = document.querySelector(".dashboard-sidebar");

		var rule = document.createElement("div");
		rule.classList.add("rule");
		sidebar.insertBefore(rule, sidebar.firstChild);

		var ul = document.createElement("ul");
		ul.classList.add("filter-list");
		sidebar.insertBefore(ul, sidebar.firstChild);

		var lis = filters.map(function(filter) {
			var a = document.createElement("a");
			a.classList.add("filter-item");
			a.setAttribute("href", "/");
			a.setAttribute("title", filter.classNames.join(" & "));
			if (filter.classNames[0] === "*") { a.classList.add("selected"); }

			var s = document.createElement("span");
			s.classList.add("octicon", filter.icon);
			s.style.marginRight = "10px";
			s.style.cssFloat = "left";
			a.appendChild(s);

			var c = document.createElement("span");
			c.classList.add("count");
			c.appendChild(document.createTextNode("0"));
			a.appendChild(c);

			a.appendChild(document.createTextNode(filter.text));

			a.addEventListener("click", proxy(function(e, className) {
				e.preventDefault();

				Array.forEach(container.querySelectorAll(".alert"), function(alert) {
					alert.style.display = className[0] === "*" || className.some(function(cl) { return alert.classList.contains(cl); }) ? "block" : "none";
				});

				Array.forEach(sidebar.querySelectorAll(".selected"), function(m) { m.classList.remove("selected"); });
				this.classList.add("selected");
			}, filter.classNames));

			var li = document.createElement("li");
			li.appendChild(a);

			ul.appendChild(li);

			return li;
		});

		// update on clicking "More"-button;
		$.pageUpdate(function() {
			window.setTimeout(function() {
				Array.forEach(container.querySelectorAll(".alert"), function(alert) {
					if (alert.getElementsByClassName("octicon-git-pull-request").length > 0) {
						alert.classList.remove("issues_opened", "issues_closed");
						alert.classList.add("pull_request");
					} else if (alert.classList.contains("issues_comment") && alert.querySelectorAll(".title a")[1].getAttribute("href").split("/")[5] === "pull") {
						alert.classList.remove("issues_comment");
						alert.classList.add("pull_request_comment");
					}
				});

				Array.forEach(sidebar.querySelectorAll(".count"), function(c) {
					c.textContent = "0";
				});
				filters.forEach(function(filter, index) {
					var c = lis[index].querySelector(".count");
					if (filter.classNames[0] === "*") {
						c.textContent = container.querySelectorAll(".alert").length;
					} else {
						Array.forEach(container.querySelectorAll(".alert"), function(alert) {
							if (filter.classNames.some(function(cl) { return alert.classList.contains(cl); })) {
								c.textContent = parseInt(c.textContent, 10) + 1;
							}
						});
					}
				});

				sidebar.querySelector(".selected").dispatchEvent(new Event("click"));
			}, 1);
		});
	}

	// init;
	addFilters();

	// on pjax;
	$(document).on("pjax:success", addFilters);

})();