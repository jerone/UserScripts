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
// @include     https://github.com/orgs/*/dashboard
// @version     4.6
// @grant       none
// ==/UserScript==

(function() {

	var filters = [
		{ text: "All News Feed", icon: "octicon-radio-tower", classNames: ["*"] },
		{
			text: "Issues", icon: "octicon-issue-opened", classNames: ["issues_comment", "issues_opened", "issues_closed", "issues_reopened"], subFilters: [
				{ text: "Comments", icon: "octicon-comment-discussion", classNames: ["issues_comment"] },
				{ text: "Opened", icon: "octicon-issue-opened", classNames: ["issues_opened"] },
				{ text: "Closed", icon: "octicon-issue-closed", classNames: ["issues_closed"] },
				{ text: "Reopened", icon: "octicon-issue-reopened", classNames: ["issues_reopened"] }
			]
		},
		{ text: "Commits", icon: "octicon-git-commit", classNames: ["push", "commit_comment"] },
		{ text: "Pull Requests", icon: "octicon-git-pull-request", classNames: ["pull_request", "pull_request_comment"] },
		{ text: "Repo", icon: "octicon-repo", classNames: ["create", "delete", "public", "release", "fork"] },
		{
			text: "User", icon: "octicon-person", classNames: ["watch_started", "member_add", "team_add"], subFilters: [
				{ text: "Starred", icon: "octicon-star", classNames: ["watch_started"] },
				{ text: "Member added", icon: "octicon-person-add", classNames: ["member_add", "team_add"] }
			]
		},
		{ text: "Wiki", icon: "octicon-book", classNames: ["gollum"] },
		{
			text: "Gist", icon: "octicon-gist", classNames: ["gist_created", "gist_updated"], subFilters: [
				{ text: "Created", icon: "octicon-gist-new", classNames: ["gist_created"] },
				{ text: "Updated", icon: "octicon-gist", classNames: ["gist_updated"] }
			]
		}
		// Possible other classes: follow
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

		a.addEventListener("click", proxy(function(e, classNames) {
			e.preventDefault();

			var any = false,
				all = classNames[0] === "*",
				some = function(alert) { return classNames.some(function(cl) { return alert.classList.contains(cl); }); };
			Array.forEach(container.querySelectorAll(".alert"), function(alert) {
				alert.style.display = (all || some(alert)) && (any = true) ? "block" : "none";
			});
			var none = container.querySelector(".no-alerts");
			if (any && none) {
				none.parentNode.removeChild(none);
			} else if (!any && !none) {
				none = document.createElement("div");
				none.classList.add("no-alerts");
				none.style.padding = "0 0 1em 45px";
				none.style.fontStyle = "italic";
				none.appendChild(document.createTextNode("No feed items for this filter. Press the button below to load more items..."));
				container.insertBefore(none, container.firstChild);
			}

			Array.forEach(sidebar.querySelectorAll(".filter-list.small"), function(subUl) { subUl.style.display = "none"; });
			var subUl = this.parentNode.querySelector("ul");
			if (!subUl && this.parentNode.parentNode.classList.contains("filter-list") && this.parentNode.parentNode.classList.contains("small")) {
				subUl = this.parentNode.parentNode;
			}
			subUl && (subUl.style.display = "block");

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
		unsafeWindow.$.pageUpdate(function() {
			window.setTimeout(function() {
				Array.forEach(container.querySelectorAll(".alert"), function(alert) {
					if (alert.getElementsByClassName("octicon-git-pull-request").length > 0) {
						alert.classList.remove("issues_opened", "issues_closed");
						alert.classList.add("pull_request");
					} else if (alert.classList.contains("issues_comment") && alert.querySelectorAll(".title a")[1].getAttribute("href").split("/")[5] === "pull") {
						alert.classList.remove("issues_comment");
						alert.classList.add("pull_request_comment");
					} else if (alert.classList.contains("gist")) {
						alert.classList.remove("gist");
						alert.classList.add("gist_" + alert.querySelector(".title span").textContent);
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
	unsafeWindow.$(document).on("pjax:success", addFilters);

})();
