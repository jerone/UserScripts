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
// @version     4.1
// @grant       none
// ==/UserScript==

(function() {

	var filters = [
		{ text: "All News Feed", icon: "octicon-radio-tower", classNames: ["*"] },
		{ text: "Commits", icon: "octicon-git-commit", classNames: ["push"] },
		{ text: "Pull Requests", icon: "octicon-git-pull-request", classNames: ["pull_request", "pull_request_comment"] },
		{
			text: "Issues", icon: "octicon-issue-opened", classNames: ["issues_comment", "issues_opened", "issues_closed", "issues_reopened"], subFilters: [
				{ text: "Comments", icon: "octicon-comment-discussion", classNames: ["issues_comment"] },
				{ text: "Opened", icon: "octicon-issue-opened", classNames: ["issues_opened"] },
				{ text: "Closed", icon: "octicon-issue-closed", classNames: ["issues_closed"] },
				{ text: "Reopened", icon: "octicon-issue-reopened", classNames: ["issues_reopened"] }
			]
		},
		{ text: "Stars", icon: "octicon-star", classNames: ["watch_started"] },
		{ text: "Repo", icon: "octicon-repo", classNames: ["create", "public", "release", "fork"] },
		{ text: "Wiki", icon: "octicon-book", classNames: ["gollum"] },
		{ text: "Gist", icon: "octicon-gist", classNames: ["gist"] }
		// Pissible other classes: commit_comment & follow & member_add
	];

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

	function addFilterMenuItem(filter, parent, container, sidebar) {
		var a = document.createElement("a");
		a.classList.add("filter-item");
		a.setAttribute("href", "/");
		a.setAttribute("title", filter.classNames.join(" & "));
		if (filter.classNames[0] === "*") {
			a.classList.add("selected");
			a.style.fontWeight = "bold";
		}

		var s = document.createElement("span");
		s.classList.add("octicon", filter.icon);
		s.style.marginRight = "10px";
		s.style.cssFloat = "left";
		s.style.minWidth = "16px";
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

			Array.forEach(sidebar.querySelectorAll(".filter-list.small"), function(subUl) {
				subUl.style.display = "none";
			});
			var subUl = this.parentNode.querySelector("ul");
			if (!subUl && this.parentNode.parentNode.classList.contains("filter-list") && this.parentNode.parentNode.classList.contains("small")) {
				subUl = this.parentNode.parentNode;
			}
			if (subUl) {
				subUl.style.display = "block";
			}

			Array.forEach(sidebar.querySelectorAll(".selected"), function(m) { m.classList.remove("selected"); });
			this.classList.add("selected");
		}, filter.classNames));

		var li = document.createElement("li");
		li.appendChild(a);
		li.filterClassNames = filter.classNames;

		parent.appendChild(li);

		return li;
	}

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

		filters.forEach(function(filter) {
			var li = addFilterMenuItem(filter, ul, container, sidebar);

			if (filter.subFilters) {
				var subUl = document.createElement("ul");
				subUl.classList.add("filter-list", "small");
				subUl.style.marginLeft = "10px";
				subUl.style.display = "none";
				li.appendChild(subUl);

				filter.subFilters.forEach(function(subFilter) {
					addFilterMenuItem(subFilter, subUl, container, sidebar);
				});
			}
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

				Array.forEach(ul.querySelectorAll("li"), function(li) {
					var c = li.querySelector(".count");
					if (li.filterClassNames[0] === "*") {
						c.textContent = container.querySelectorAll(".alert").length;
					} else {
						c.textContent = "0";
						Array.forEach(container.querySelectorAll(".alert"), function(alert) {
							if (li.filterClassNames.some(function(cl) { return alert.classList.contains(cl); })) {
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