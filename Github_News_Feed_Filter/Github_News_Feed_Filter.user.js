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
		{ id: "*", text: "All news feed", icon: "octicon-radio-tower", classNames: ["*"] },
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
				{ id: "repo deleted", text: "Deleted", icon: "octicon-repo-delete", classNames: ["delete"] },
				{ id: "repo released", text: "Release", icon: "octicon-repo-pull", classNames: ["release"] },
				{
					id: "repo branched", text: "Branch", icon: "octicon-git-branch", classNames: ["branch_create", "branch_delete"], subFilters: [
						{ id: "repo branch created", text: "Created", icon: "octicon-git-branch-create", classNames: ["branch_create"] },
						{ id: "repo branch deleted", text: "Deleted", icon: "octicon-git-branch-delete", classNames: ["branch_delete"] }
					]
				},
				{
					id: "repo tagged", text: "Tag", icon: "octicon-tag", classNames: ["tag_add", "tag_remove"], subFilters: [
						{ id: "repo tag added", text: "Added", icon: "octicon-tag-add", classNames: ["tag_add"] },
						{ id: "repo tag removed", text: "Removed", icon: "octicon-tag-remove", classNames: ["tag_remove"] }
					]
				}
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

	function addStyle(css) {
		var node = document.createElement("style");
		node.type = "text/css";
		node.appendChild(document.createTextNode(css));
		document.head.appendChild(node);
	}

	addStyle("\
	.GitHubNewsFeedFilter .count { margin-right: 15px; }\
	\
	.GitHubNewsFeedFilter .filter-list .filter-list .mini-repo-list-item { padding-left: 40px; border-top: 1px dashed #E5E5E5; }\
	.GitHubNewsFeedFilter .filter-list .filter-list .filter-list .mini-repo-list-item { padding-left: 50px; }\
	\
	.GitHubNewsFeedFilter .filter-list-item > ul  { display: none; }\
	.GitHubNewsFeedFilter .filter-list-item.open > ul  { display: block; }\
	\
	.GitHubNewsFeedFilter .private  { font-weight: bold; }\
	\
	.GitHubNewsFeedFilter .stars .octicon  { position: absolute; right: -4px; }\
	.GitHubNewsFeedFilter .filter-list-item.open > a > .stars > .octicon:before { content: '\\f05b'; }\
	")

	function addFilterMenu(filters, parent, container, sidebar, main) {
		var ul = document.createElement("ul");
		ul.classList.add("filter-list");
		if (main) {
			ul.classList.add("boxed-group-inner", "mini-repo-list");
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
		a.classList.add("mini-repo-list-item", "css-truncate");
		a.setAttribute("href", "/");
		a.setAttribute("title", filter.classNames.join(" & "));
		a.dataset[datasetId] = filter.id;

		var i = document.createElement("span");
		i.classList.add("repo-icon", "octicon", filter.icon);
		a.appendChild(i);

		var s = document.createElement("span");
		s.classList.add("stars");
		var c = document.createElement("span");
		c.classList.add("count");
		c.appendChild(document.createTextNode("0"));
		s.appendChild(c);
		if (filter.subFilters) {
			s.appendChild(document.createTextNode(" "));
			var o = document.createElement("span");
			o.classList.add("octicon", "octicon-triangle-left");
			s.appendChild(o);
		}
		a.appendChild(s);

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

			// Open/close sub list;
			Array.forEach(sidebar.querySelectorAll(".GitHubNewsFeedFilter .open"), function(item) { item.classList.remove("open"); });
			showParentMenu(this);
			this.parentNode.classList.add("open");

			// Give it a colored background;
			Array.forEach(sidebar.querySelectorAll(".GitHubNewsFeedFilter .private"), function(m) { m.classList.remove("private"); });
			this.parentNode.classList.add("private");

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
		li.classList.add("filter-list-item");
		li.appendChild(a);
		li.filterClassNames = filter.classNames;

		parent.appendChild(li);

		return li;
	}

	// traverse back up the tree to open sub lists;
	function showParentMenu(menuItem) {
		var parentMenuItem = menuItem.parentNode;
		if (parentMenuItem.classList.contains("filter-list-item")) {
			parentMenuItem.classList.add("open");
			showParentMenu(parentMenuItem.parentNode);
		}
	}

	function pageUpdate(container, sidebar, wrapper) {
		Array.forEach(container.querySelectorAll(".alert"), function(alert) {
			if (alert.getElementsByClassName("octicon-git-branch").length > 0 && !alert.classList.contains("fork")) {
				alert.classList.remove("create");
				alert.classList.add("branch_create");
			} else if (alert.getElementsByClassName("octicon-git-branch-delete").length > 0) {
				alert.classList.remove("delete");
				alert.classList.add("branch_delete");
			} else if (alert.getElementsByClassName("octicon-tag").length > 0) {
				alert.classList.remove("create");
				alert.classList.add("tag_add");
			} else if (alert.getElementsByClassName("octicon-tag-remove").length > 0) {
				alert.classList.remove("delete");
				alert.classList.add("tag_remove");
			} else if (alert.getElementsByClassName("octicon-git-pull-request").length > 0) {
				if (alert.classList.contains("issues_opened")) {
					alert.classList.remove("issues_opened");
					alert.classList.add("pull_request_opened");
				} else if (alert.classList.contains("issues_closed")) {
					alert.classList.remove("issues_closed");
					if (!!~alert.querySelector('.title').textContent.indexOf('merged pull request')) {
						alert.classList.add("pull_request_merged");
					} else {
						alert.classList.add("pull_request_closed");
					}
				}
			} else if (alert.classList.contains("issues_comment") && alert.querySelectorAll(".title a")[1].href.split("/")[5] === "pull") {
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
		wrapper.querySelector('.GitHubNewsFeedFilter [data-github-news-feed-filter-id="' + filter + '"]').dispatchEvent(new Event("click"));
	}

	function addFilters() {
		var container = document.querySelector(".news");
		if (!container) { return; }

		var sidebar = document.querySelector(".dashboard-sidebar") || document.querySelector(".column.one-fourth.vcard");

		var rule = document.createElement("div");
		rule.classList.add("rule");
		sidebar.insertBefore(rule, sidebar.firstChild);

		var wrapper = document.createElement("div");
		wrapper.classList.add("GitHubNewsFeedFilter", "boxed-group", "flush");
		sidebar.insertBefore(wrapper, sidebar.firstChild);

		var header = document.createElement("h3");
		header.appendChild(document.createTextNode("News feed filter"));
		wrapper.appendChild(header);

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
