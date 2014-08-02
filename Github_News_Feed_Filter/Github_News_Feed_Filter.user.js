// ==UserScript==
// @name        Github News Feed Filter
// @namespace   https://github.com/jerone/UserScripts
// @description Add filters for Github homepage news feed items
// @author      jerone
// @copyright   2014+, jerone (http://jeroenvanwarmerdam.nl)
// @license     GNU GPLv3
// @homepage    https://github.com/jerone/UserScripts/tree/master/Github_News_Feed_Filter
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Github_News_Feed_Filter
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Github_News_Feed_Filter/Github_News_Feed_Filter.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Github_News_Feed_Filter/Github_News_Feed_Filter.user.js
// @include     https://github.com/
// @include     https://github.com/?*
// @include     https://github.com/orgs/*/dashboard
// @include     https://github.com/orgs/*/dashboard?*
// @include     https://github.com/*tab=activity*
// @version     5.3
// @grant       none
// ==/UserScript==
/* global Event */

(function() {

	var FILTERS = [
		{ id: "*", text: "All News Feed", icon: "octicon-radio-tower", classNames: ["*"] },
		{
			id: "issues", text: "Issues", icon: "octicon-issue-opened", classNames: ["issues_opened", "issues_closed", "issues_reopened", "issues_comment"], subFilters: [
				{ id: "issues opened", text: "Opened", icon: "octicon-issue-opened", classNames: ["issues_opened"] },
				{ id: "issues closed", text: "Closed", icon: "octicon-issue-closed", classNames: ["issues_closed"] },
				{ id: "issues reopened", text: "Reopened", icon: "octicon-issue-reopened", classNames: ["issues_reopened"] },
				{ id: "issues comments", text: "Comments", icon: "octicon-comment-discussion", classNames: ["issues_comment"] }
			]
		},
		{
			id: "commits", text: "Commits", icon: "octicon-git-commit", classNames: ["push", "commit_comment"], subFilters: [
				{ id: "commits pushed", text: "Pushed", icon: "octicon-git-commit", classNames: ["push"] },
				{ id: "commits comments", text: "Comments", icon: "octicon-comment-discussion", classNames: ["commit_comment"] }
			]
		},
		{
			id: "pr", text: "Pull Requests", icon: "octicon-git-pull-request", classNames: ["pull_request_opened", "pull_request_closed", "pull_request_merged", "pull_request_comment"], subFilters: [
				{ id: "pr opened", text: "Opened", icon: "octicon-git-pull-request", classNames: ["pull_request_opened"] },
				{ id: "pr closed", text: "Closed", icon: "octicon-git-pull-request-abandoned", classNames: ["pull_request_closed"] },
				{ id: "pr merged", text: "Merged", icon: "octicon-git-merge", classNames: ["pull_request_merged"] },
				{ id: "pr comments", text: "Comments", icon: "octicon-comment-discussion", classNames: ["pull_request_comment"] }
			]
		},
		{
			id: "repo", text: "Repo", icon: "octicon-repo", classNames: ["create", "public", "fork", "branch_create", "branch_delete", "tag_add", "tag_remove", "release", "delete"], subFilters: [
				{ id: "repo created", text: "Created", icon: "octicon-repo-create", classNames: ["create"] },
				{ id: "repo public", text: "Public", icon: "octicon-repo-push", classNames: ["public"] },
				{ id: "repo forked", text: "Forked", icon: "octicon-repo-forked", classNames: ["fork"] },
				{
					id: "repo branched", text: "Branched", icon: "octicon-git-branch", classNames: ["branch_create", "branch_delete"], subFilters: [
						{ id: "repo branch created", text: "Created", icon: "octicon-git-branch-create", classNames: ["branch_create"] },
						{ id: "repo branch deleted", text: "Deleted", icon: "octicon-git-branch-delete", classNames: ["branch_delete"] }
					]
				},
				{
					id: "repo tagged", text: "Tagged", icon: "octicon-tag", classNames: ["tag_add", "tag_remove"], subFilters: [
						{ id: "repo tag added", text: "Added", icon: "octicon-tag-add", classNames: ["tag_add"] },
						{ id: "repo tag removed", text: "Removed", icon: "octicon-tag-remove", classNames: ["tag_remove"] }
					]
				},
				{ id: "repo released", text: "Released", icon: "octicon-repo-pull", classNames: ["release"] },
				{ id: "repo deleted", text: "Deleted", icon: "octicon-repo-delete", classNames: ["delete"] }
			]
		},
		{
			id: "user", text: "User", icon: "octicon-person", classNames: ["watch_started", "member_add", "team_add"], subFilters: [
				{ id: "user starred", text: "Starred", icon: "octicon-star", classNames: ["watch_started"] },
				{ id: "user added", text: "Member added", icon: "octicon-person-add", classNames: ["member_add", "team_add"] }
			]
		},
		{ id: "wiki", text: "Wiki", icon: "octicon-book", classNames: ["gollum"] },
		{
			id: "gist", text: "Gist", icon: "octicon-gist", classNames: ["gist_created", "gist_updated"], subFilters: [
				{ id: "gist created", text: "Created", icon: "octicon-gist-new", classNames: ["gist_created"] },
				{ id: "gist updated", text: "Updated", icon: "octicon-gist", classNames: ["gist_updated"] }
			]
		}
		// Possible other classes: follow
	];

	var datasetId = "githubNewsFeedFilterId";

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

	function addFilterMenu(filters, parent, container, sidebar, main) {
		var ul = document.createElement("ul");
		ul.classList.add("filter-list");
		if (!main) {
			ul.classList.add("small");
			ul.style.marginLeft = "10px";
			ul.style.display = "none";
		}
		parent.appendChild(ul);

		filters.forEach(function(subFilter) {
			var li = addFilterMenuItem(subFilter, ul, container, sidebar);

			if (subFilter.subFilters) {
				addFilterMenu(subFilter.subFilters, li, container, sidebar, false);
			}
		});
	}

	function addFilterMenuItem(filter, parent, container, sidebar) {
		var a = document.createElement("a");
		a.classList.add("filter-item");
		a.setAttribute("href", "/");
		a.setAttribute("title", filter.classNames.join(" & "));
		a.dataset[datasetId] = filter.id;

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

			Array.forEach(sidebar.querySelectorAll(".filter-list.small"), function(ul) { ul.style.display = "none"; });
			showParentMenu(a.parentNode);
			var subMenu = a.parentNode.querySelector("ul");
			if (subMenu) { subMenu.style.display = "block"; }

			Array.forEach(sidebar.querySelectorAll(".selected"), function(m) { m.classList.remove("selected"); });
			this.classList.add("selected");

			if (this.dataset[datasetId] !== "*") {
				var urlSearch = "filter=" + encodeURIComponent(this.dataset[datasetId]);
				history.pushState(null, null, location.search && /filter=[^&]*/g.test(location.search)
												? location.href.replace(/filter=[^&]*/g, urlSearch)
												: location.href + (location.search ? "&" : "?") + urlSearch);
			} else {
				history.pushState(null, null, location.href.replace(/(filter=[^&]*&|\?filter=[^&]*$|&filter=[^&]*)/g, ""));  // http://regexr.com/398lv
			}
		}, filter.classNames));

		var li = document.createElement("li");
		li.appendChild(a);
		li.filterClassNames = filter.classNames;

		parent.appendChild(li);

		return li;
	}

	function showParentMenu(menuItem) {
		var parentMenuItem = menuItem.parentNode;
		if (parentMenuItem.classList.contains("filter-list")) {
			parentMenuItem.style.display = "block";
			showParentMenu(parentMenuItem.parentNode);
		}
	}

	function pageUpdate(container, sidebar, wrapper) {
		Array.forEach(container.querySelectorAll(".alert"), function(alert) {
			if (alert.getElementsByClassName("octicon-git-branch-create").length > 0) {
				alert.classList.remove("create");
				alert.classList.add("branch_create");
			} else if (alert.getElementsByClassName("octicon-git-branch-delete").length > 0) {
				alert.classList.remove("delete");
				alert.classList.add("branch_delete");
			} else if (alert.getElementsByClassName("octicon-tag-add").length > 0) {
				alert.classList.remove("create");
				alert.classList.add("tag_add");
			} else if (alert.getElementsByClassName("octicon-tag-remove").length > 0) {
				alert.classList.remove("delete");
				alert.classList.add("tag_remove");
			} else if (alert.getElementsByClassName("octicon-git-pull-request").length > 0) {
				alert.classList.remove("issues_opened", "issues_closed");
				if (alert.querySelector(".title span").textContent.toUpperCase() === "OPENED") {  // English localisation;
					alert.classList.add("pull_request_opened");
				} else if (alert.querySelector(".title span").textContent.toUpperCase() === "MERGED") {  // English localisation;
					alert.classList.add("pull_request_merged");
				} else if (alert.querySelector(".title span").textContent.toUpperCase() === "CLOSED") {  // English localisation;
					alert.classList.add("pull_request_closed");
				}
			} else if (alert.classList.contains("issues_comment") && alert.querySelectorAll(".title a")[1].getAttribute("href").split("/")[5] === "pull") {
				alert.classList.remove("issues_comment");
				alert.classList.add("pull_request_comment");
			} else if (alert.classList.contains("gist")) {
				alert.classList.remove("gist");
				alert.classList.add("gist_" + alert.querySelector(".title span").textContent);
			}
		});

		Array.forEach(wrapper.querySelectorAll("li"), function(li) {
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

		var filter = /filter=[^&]*/g.test(location.search)
						? decodeURIComponent(/filter=([^&]*)/g.exec(location.search)[1])
						: "*";
		wrapper.querySelector('.filter-item[data-github-news-feed-filter-id="' + filter + '"]').dispatchEvent(new Event("click"));
	}

	function addFilters() {
		var container = document.querySelector(".news");
		if (!container) { return; }

		var sidebar = document.querySelector(".dashboard-sidebar") || document.querySelector(".column.one-fourth.vcard");

		var rule = document.createElement("div");
		rule.classList.add("rule");
		sidebar.insertBefore(rule, sidebar.firstChild);

		var wrapper = document.createElement("div");
		sidebar.insertBefore(wrapper, sidebar.firstChild);

		addFilterMenu(FILTERS, wrapper, container, sidebar, true);

		pageUpdate(container, sidebar, wrapper);

		// update on clicking "More"-button;
		new MutationObserver(function() {
			pageUpdate(container, sidebar, wrapper);
		}).observe(container, { childList: true });
	}

	// init;
	addFilters();

})();
