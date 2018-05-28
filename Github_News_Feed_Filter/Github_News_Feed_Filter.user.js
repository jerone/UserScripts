// ==UserScript==
// @name        Github News Feed Filter
// @namespace   https://github.com/jerone/UserScripts
// @description Add filters for GitHub homepage news feed items
// @author      jerone
// @contributor darkred
// @copyright   2014+, jerone (http://jeroenvanwarmerdam.nl)
// @license     GPL-3.0
// @homepage    https://github.com/jerone/UserScripts/tree/master/Github_News_Feed_Filter
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Github_News_Feed_Filter
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Github_News_Feed_Filter/Github_News_Feed_Filter.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Github_News_Feed_Filter/Github_News_Feed_Filter.user.js
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @icon        https://assets-cdn.github.com/pinned-octocat.svg
// @include     https://github.com/
// @include     https://github.com/?*
// @include     https://github.com/orgs/*/dashboard
// @include     https://github.com/orgs/*/dashboard?*
// @version     8.2.4
// @grant       none
// ==/UserScript==

(function() {

	var ICONS = {};
	ICONS['octicon-book'] = 'M3 5h4v1H3V5zm0 3h4V7H3v1zm0 2h4V9H3v1zm11-5h-4v1h4V5zm0 2h-4v1h4V7zm0 2h-4v1h4V9zm2-6v9c0 .55-.45 1-1 1H9.5l-1 1-1-1H2c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h5.5l1 1 1-1H15c.55 0 1 .45 1 1zm-8 .5L7.5 3H2v9h6V3.5zm7-.5H9.5l-.5.5V12h6V3z';
	ICONS['octicon-comment-discussion'] = 'M15 1H6c-.55 0-1 .45-1 1v2H1c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h1v3l3-3h4c.55 0 1-.45 1-1V9h1l3 3V9h1c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zM9 11H4.5L3 12.5V11H1V5h4v3c0 .55.45 1 1 1h3v2zm6-3h-2v1.5L11.5 8H6V2h9v6z';
	ICONS['octicon-git-branch'] = 'M10 5c0-1.11-.89-2-2-2a1.993 1.993 0 0 0-1 3.72v.3c-.02.52-.23.98-.63 1.38-.4.4-.86.61-1.38.63-.83.02-1.48.16-2 .45V4.72a1.993 1.993 0 0 0-1-3.72C.88 1 0 1.89 0 3a2 2 0 0 0 1 1.72v6.56c-.59.35-1 .99-1 1.72 0 1.11.89 2 2 2 1.11 0 2-.89 2-2 0-.53-.2-1-.53-1.36.09-.06.48-.41.59-.47.25-.11.56-.17.94-.17 1.05-.05 1.95-.45 2.75-1.25S8.95 7.77 9 6.73h-.02C9.59 6.37 10 5.73 10 5zM2 1.8c.66 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm0 12.41c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm6-8c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z';
	ICONS['octicon-git-branch-create'] = ICONS['octicon-git-branch'];
	ICONS['octicon-git-branch-delete'] = ICONS['octicon-git-branch'];
	ICONS['octicon-git-commit'] = 'M10.86 7c-.45-1.72-2-3-3.86-3-1.86 0-3.41 1.28-3.86 3H0v2h3.14c.45 1.72 2 3 3.86 3 1.86 0 3.41-1.28 3.86-3H14V7h-3.14zM7 10.2c-1.22 0-2.2-.98-2.2-2.2 0-1.22.98-2.2 2.2-2.2 1.22 0 2.2.98 2.2 2.2 0 1.22-.98 2.2-2.2 2.2z';
	ICONS['octicon-home'] = 'M16 9l-3-3V2h-2v2L8 1 0 9h2l1 5c0 .55.45 1 1 1h8c.55 0 1-.45 1-1l1-5h2zm-4 5H9v-4H7v4H4L2.81 7.69 8 2.5l5.19 5.19L12 14z';
	ICONS['octicon-issue-opened'] = 'M7 2.3c3.14 0 5.7 2.56 5.7 5.7S10.14 13.7 7 13.7 1.3 11.14 1.3 8s2.56-5.7 5.7-5.7m0-1.3C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7S10.86 1 7 1z m1 3H6v5h2V4z m0 6H6v2h2V10z';
	ICONS['octicon-person'] = 'M12 14.002a.998.998 0 0 1-.998.998H1.001A1 1 0 0 1 0 13.999V13c0-2.633 4-4 4-4s.229-.409 0-1c-.841-.62-.944-1.59-1-4 .173-2.413 1.867-3 3-3s2.827.586 3 3c-.056 2.41-.159 3.38-1 4-.229.59 0 1 0 1s4 1.367 4 4v1.002z';
	ICONS['octicon-organization'] = 'M16 12.999c0 .439-.45 1-1 1H7.995c-.539 0-.994-.447-.995-.999H1c-.54 0-1-.561-1-1 0-2.634 3-4 3-4s.229-.409 0-1c-.841-.621-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.442.58 2.5 3c.058 2.41-.159 2.379-1 3-.229.59 0 1 0 1s1.549.711 2.42 2.088C9.196 9.369 10 8.999 10 8.999s.229-.409 0-1c-.841-.62-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.437.581 2.495 3c.059 2.41-.158 2.38-1 3-.229.59 0 1 0 1s3.005 1.366 3.005 4';
	ICONS['octicon-plus'] = 'M12 9H7v5H5V9H0V7h5V2h2v5h5z';
	ICONS['octicon-radio-tower'] = 'M4.79 6.11c.25-.25.25-.67 0-.92-.32-.33-.48-.76-.48-1.19 0-.43.16-.86.48-1.19.25-.26.25-.67 0-.92a.613.613 0 0 0-.45-.19c-.16 0-.33.06-.45.19-.57.58-.85 1.35-.85 2.11 0 .76.29 1.53.85 2.11.25.25.66.25.9 0zM2.33.52a.651.651 0 0 0-.92 0C.48 1.48.01 2.74.01 3.99c0 1.26.47 2.52 1.4 3.48.25.26.66.26.91 0s.25-.68 0-.94c-.68-.7-1.02-1.62-1.02-2.54 0-.92.34-1.84 1.02-2.54a.66.66 0 0 0 .01-.93zm5.69 5.1A1.62 1.62 0 1 0 6.4 4c-.01.89.72 1.62 1.62 1.62zM14.59.53a.628.628 0 0 0-.91 0c-.25.26-.25.68 0 .94.68.7 1.02 1.62 1.02 2.54 0 .92-.34 1.83-1.02 2.54-.25.26-.25.68 0 .94a.651.651 0 0 0 .92 0c.93-.96 1.4-2.22 1.4-3.48A5.048 5.048 0 0 0 14.59.53zM8.02 6.92c-.41 0-.83-.1-1.2-.3l-3.15 8.37h1.49l.86-1h4l.84 1h1.49L9.21 6.62c-.38.2-.78.3-1.19.3zm-.01.48L9.02 11h-2l.99-3.6zm-1.99 5.59l1-1h2l1 1h-4zm5.19-11.1c-.25.25-.25.67 0 .92.32.33.48.76.48 1.19 0 .43-.16.86-.48 1.19-.25.26-.25.67 0 .92a.63.63 0 0 0 .9 0c.57-.58.85-1.35.85-2.11 0-.76-.28-1.53-.85-2.11a.634.634 0 0 0-.9 0z';
	ICONS['octicon-repo'] = 'M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z';
	ICONS['octicon-repo-clone'] = 'M15 0H9v7c0 .55.45 1 1 1h1v1h1V8h3c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1zm-4 7h-1V6h1v1zm4 0h-3V6h3v1zm0-2h-4V1h4v4zM4 5H3V4h1v1zm0-2H3V2h1v1zM2 1h6V0H1C.45 0 0 .45 0 1v12c0 .55.45 1 1 1h2v2l1.5-1.5L6 16v-2h5c.55 0 1-.45 1-1v-3H2V1zm9 10v2H6v-1H3v1H1v-2h10zM3 8h1v1H3V8zm1-1H3V6h1v1z';
	ICONS['octicon-repo-create'] = ICONS['octicon-plus'];
	ICONS['octicon-repo-push'] = 'M4 3H3V2h1v1zM3 5h1V4H3v1zm4 0L4 9h2v7h2V9h2L7 5zm4-5H1C.45 0 0 .45 0 1v12c0 .55.45 1 1 1h4v-1H1v-2h4v-1H2V1h9.02L11 10H9v1h2v2H9v1h2c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1z';
	ICONS['octicon-repo-forked'] = 'M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z';
	ICONS['octicon-repo-delete'] = ICONS['octicon-repo'];
	ICONS['octicon-repo-pull'] = 'M13 8V6H7V4h6V2l3 3-3 3zM4 2H3v1h1V2zm7 5h1v6c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1v2h-1V1H2v9h9V7zm0 4H1v2h2v-1h3v1h5v-2zM4 6H3v1h1V6zm0-2H3v1h1V4zM3 9h1V8H3v1z';
	ICONS['octicon-star'] = 'M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74z';
	ICONS['octicon-tag'] = 'M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 0 0 0-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z';
	ICONS['octicon-tag-add'] = ICONS['octicon-tag'];
	ICONS['octicon-tag-remove'] = ICONS['octicon-tag'];
	ICONS['octicon-triangle-left'] = 'M6 2L0 8l6 6z';

	var ACTIONS = [
		{ id: '*-action', text: 'All news feed', icon: 'octicon-radio-tower', classNames: ['*-action'] },
		{
			id: 'issues', text: 'Issues', icon: 'octicon-issue-opened', classNames: ['issues_labeled'], subFilters: [
				{ id: 'issues labeled', text: 'Labeled', icon: 'octicon-tag', classNames: ['issues_labeled'] },
			]
		},
		{
			id: 'commits', text: 'Commits', icon: 'octicon-git-commit', classNames: ['push', 'commit_comment'], subFilters: [
				{ id: 'commits pushed', text: 'Pushed', icon: 'octicon-git-commit', classNames: ['push'] },
				{ id: 'commits comments', text: 'Comments', icon: 'octicon-comment-discussion', classNames: ['commit_comment'] }
			]
		},
		{
			id: 'repo', text: 'Repo', icon: 'octicon-repo', classNames: ['repo', 'create', 'public', 'fork', 'branch_create', 'branch_delete', 'tag_add', 'tag_remove', 'release', 'delete'], subFilters: [
				{ id: 'repo created', text: 'Created', icon: 'octicon-repo-create', classNames: ['repo', 'create'] },
				{ id: 'repo public', text: 'Public', icon: 'octicon-repo-push', classNames: ['public'] },
				{ id: 'repo forked', text: 'Forked', icon: 'octicon-repo-forked', classNames: ['fork'] },
				{ id: 'repo deleted', text: 'Deleted', icon: 'octicon-repo-delete', classNames: ['delete'] },
				{ id: 'repo released', text: 'Release', icon: 'octicon-repo-pull', classNames: ['release'] },
				{
					id: 'repo branched', text: 'Branch', icon: 'octicon-git-branch', classNames: ['branch_create', 'branch_delete'], subFilters: [
						{ id: 'repo branch created', text: 'Created', icon: 'octicon-git-branch-create', classNames: ['branch_create'] },
						{ id: 'repo branch deleted', text: 'Deleted', icon: 'octicon-git-branch-delete', classNames: ['branch_delete'] }
					]
				},
				{
					id: 'repo tagged', text: 'Tag', icon: 'octicon-tag', classNames: ['tag_add', 'tag_remove'], subFilters: [
						{ id: 'repo tag added', text: 'Added', icon: 'octicon-tag-add', classNames: ['tag_add'] },
						{ id: 'repo tag removed', text: 'Removed', icon: 'octicon-tag-remove', classNames: ['tag_remove'] }
					]
				}
			]
		},
		{ id: 'user', text: 'User', icon: 'octicon-person', classNames: ['follow'] },
		{ id: 'starred', text: 'Starred', icon: 'octicon-star', classNames: ['watch_started'] },
		{
			id: 'wiki', text: 'Wiki', icon: 'octicon-book', classNames: ['wiki_created', 'wiki_edited'], subFilters: [
				{ id: 'wiki created', text: 'Created', icon: 'octicon-plus', classNames: ['wiki_created'] },
				{ id: 'wiki edited', text: 'Edited', icon: 'octicon-book', classNames: ['wiki_edited'] }
			]
		}
	];

	var REPOS = [];

	var USERS = [];

	var datasetId = 'githubNewsFeedFilter';
	var datasetIdLong = 'data-github-news-feed-filter';
	var filterElement = 'github-news-feed-filter';
	var filterListElement = 'github-news-feed-filter-list';

	function proxy(fn) {
		return function() {
			var that = this;
			return function(e) {
				var args = that.slice(0); // Clone.
				args.unshift(e); // Prepend event.
				fn.apply(this, args);
			};
		}.call([].slice.call(arguments, 1));
	}

	function addStyle(css) {
		var node = document.createElement('style');
		node.type = 'text/css';
		node.appendChild(document.createTextNode(css));
		document.head.appendChild(node);
	}

	addStyle(`
		github-news-feed-filter { display: block; }
		github-news-feed-filter .count { margin-right: 15px; }

		github-news-feed-filter .filter-list .mini-repo-list-item { padding-right: 64px; }

		github-news-feed-filter .filter-list .filter-list .mini-repo-list-item { padding-left: 40px; border-top: 1px dashed #E5E5E5; }
		github-news-feed-filter .filter-list .filter-list .filter-list .mini-repo-list-item { padding-left: 50px; }

		github-news-feed-filter .filter-list { display: none; }
		github-news-feed-filter .open > .filter-list { display: block; }
		github-news-feed-filter .filter-list.open { display: block; }

		github-news-feed-filter .private { font-weight: bold; }

		github-news-feed-filter .stars .octicon { position: absolute; right: -4px; }
		github-news-feed-filter .filter-list-item.open > a > .stars > .octicon { transform: rotate(-90deg); }

		.no-alerts { font-style: italic; }
		
		ul.repo-filterer > li { margin: 0px 25px 0px 0; display: inline; }
		ul.repo-filterer > li > a.filter-selected { font-weight: bold; }

	`);

	// Add filter menu list.
	function addFilterMenu(type, filters, parent, newsContainer, filterContainer, main) {
		var ul = document.createElement('ul');
		ul.classList.add('filter-list');
		if (main) {
			ul.classList.add('mini-repo-list');
		}
		parent.appendChild(ul);

		filters.forEach(function(subFilter) {
			var li = addFilterMenuItem(type, subFilter, ul, newsContainer, filterContainer);

			if (subFilter.subFilters) {
				addFilterMenu(type, subFilter.subFilters, li, newsContainer, filterContainer, false);
			}
		});
	}

	// Add filter menu item.
	function addFilterMenuItem(type, filter, parent, newsContainer, filterContainer) {
		// Filter item.
		var li = document.createElement('li');
		li.classList.add('filter-list-item');
		li.filterClassNames = filter.classNames;
		parent.appendChild(li);

		// Filter link.
		var a = document.createElement('a');
		a.classList.add('mini-repo-list-item', 'css-truncate');
		a.setAttribute('href', filter.link || '/');
		a.setAttribute('title', filter.classNames.join(' & '));
		a.dataset[datasetId] = filter.id;
		a.addEventListener('click', proxy(onFilterItemClick, type, newsContainer, filterContainer));
		li.appendChild(a);

		// Filter icon.
		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.classList.add('repo-icon', 'octicon', filter.icon);
		svg.setAttribute('height', '16');
		svg.setAttribute('width', '16');
		a.appendChild(svg);
		var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('d', ICONS[filter.icon]);
		svg.appendChild(path);

		// Filter text.
		var text = filter.text.split('/');
		var t = document.createElement('span');
		t.classList.add('repo-and-owner', 'css-truncate-target');
		a.appendChild(t);
		var to = document.createElement('span');
		to.classList.add('owner');
		to.appendChild(document.createTextNode(text[0]));
		t.appendChild(to);
		if (text.length > 1) {
			text.shift();
			t.appendChild(document.createTextNode('/'));
			var tr = document.createElement('span');
			tr.classList.add('repo');
			tr.appendChild(document.createTextNode(text.join('/')));
			t.appendChild(tr);
		}

		// Filter count & sub list arrow.
		var s = document.createElement('span');
		s.classList.add('stars');
		var c = document.createElement('span');
		c.classList.add('count');
		c.appendChild(document.createTextNode('0'));
		s.appendChild(c);
		if (filter.subFilters) {
			s.appendChild(document.createTextNode(' '));
			var osvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			osvg.classList.add('octicon', 'octicon-triangle-left');
			osvg.setAttribute('height', '16');
			osvg.setAttribute('width', '6');
			s.appendChild(osvg);
			var opath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			opath.setAttribute('d', ICONS['octicon-triangle-left']);
			osvg.appendChild(opath);
		}
		a.appendChild(s);

		return li;
	}

	// Filter item click event.
	function onFilterItemClick(e, type, newsContainer, filterContainer) {
		e.preventDefault();

		// Store current filter.
		setCurrentFilter(type, this.dataset[datasetId]);

		// Open/close sub list.
		Array.forEach(filterContainer.querySelectorAll(':scope .open'), function(item) { item.classList.remove('open'); });
		showParentMenu(this);
		this.parentNode.classList.add('open');

		// Give it a colored background.
		Array.forEach(filterContainer.querySelectorAll(':scope .private'), function(m) { m.classList.remove('private'); });
		this.parentNode.classList.add('private');

		// Toggle alert visibility.
		toggleAlertsVisibility(newsContainer);
	}

	// Toggle alert visibility.
	function toggleAlertsVisibility(newsContainer) {
		// Get selected filters.
		var anyVisibleAlert = false;
		var classNames = [];
		var selected = document.querySelectorAll(":scope " + filterElement + ' .private');
		if (selected.length > 0) {
			Array.prototype.forEach.call(selected, function(item) {
				classNames.push(item.filterClassNames);
			});
		}

		// Show/hide alerts.
		if (classNames.length === 0 || classNames.every(function(cl) { return cl.every(function(c) { return !!~c.indexOf('*'); }); })) {
			anyVisibleAlert = true;
			Array.prototype.forEach.call(newsContainer.querySelectorAll(':scope > div > .body'), function(alert) {
				alert.parentNode.style.display = 'block';
			});
		} else {
			Array.prototype.map.call(newsContainer.querySelectorAll(':scope > div > .body'), function(alert) {
				return alert.parentNode;
			}).forEach(function(alert) {
				var show = classNames.every(function(cl) { return cl.some(function(c) { return !!~c.indexOf('*') || alert.classList.contains(c); }); });
				anyVisibleAlert = show || anyVisibleAlert;
				alert.style.display = show ? 'block' : 'none';
				// DEBUG: uncomment following line and comment previous line to debug all alerts.
				//if(show) alert.style.display = 'none';
			});
		}

		// Show/hide message about no alerts.
		var none = newsContainer.querySelector(':scope .no-alerts');
		if (anyVisibleAlert && none) {
			none.parentNode.removeChild(none);
		} else if (!anyVisibleAlert && !none) {
			none = document.createElement('div');
			none.classList.add('no-alerts');
			none.appendChild(document.createTextNode('No feed items for this filter. Please select another filter.'));
			newsContainer.insertBefore(none, newsContainer.firstElementChild.nextElementSibling);
		}
	}

	// Traverse back up the tree to open sub lists.
	function showParentMenu(menuItem) {
		var parentMenuItem = menuItem.parentNode;
		if (parentMenuItem.classList.contains('filter-list-item')) {
			parentMenuItem.classList.add('open');
			showParentMenu(parentMenuItem.parentNode);
		}
	}

	// Fix filter action identification.
	function fixActionAlerts(newsContainer) {
		Array.prototype.map.call(newsContainer.querySelectorAll(':scope > div > .body'), function(alert) {
			return alert.parentNode;
		}).forEach(function(alert) {
			if (!!~alert.textContent.indexOf('created branch')) {
				alert.classList.remove('create');
				alert.classList.add('branch_create');
			} else if (!!~alert.textContent.indexOf('deleted branch')) {
				alert.classList.remove('delete');
				alert.classList.add('branch_delete');
			} else if (alert.getElementsByClassName('octicon-tag').length > 0 && !alert.classList.contains('release')) {
				alert.classList.remove('create');
				alert.classList.add('tag_add');
			} else if (alert.getElementsByClassName('octicon-tag-remove').length > 0) {
				alert.classList.remove('delete');
				alert.classList.add('tag_remove');
			} else if (!!~alert.textContent.indexOf('labeled an issue')) {
				alert.classList.add('issues_labeled');
			} else if (alert.classList.contains('gollum')) {
				alert.classList.remove('gollum');
				if (!!~alert.innerText.indexOf(' created a wiki page in ')) {
					alert.classList.add('wiki_created');
				} else if (!!~alert.innerText.indexOf(' edited a wiki page in ')) {
					alert.classList.add('wiki_edited');
				}
			}
		});
	}
	// Fix filter repo identification.
	function fixRepoAlerts(newsContainer) {
		REPOS = [{ id: '*-repo', text: 'All repositories', icon: 'octicon-repo', classNames: ['*-repo'] }];

		// Get unique list of repos.
		var userRepos = new Set();
		Array.prototype.map.call(newsContainer.querySelectorAll(':scope > div > .body'), function(alert) {
			return alert.parentNode;
		}).forEach(function(alert) {
			var alertRepo = alert.querySelector(':scope [data-ga-click*="target:repo"]:not([data-ga-click*="target:repositories"])');
			if (alertRepo) { // Follow doesn't contain a repo link.
				var userRepo = alertRepo.textContent;
				userRepos.add(userRepo);
				var repo = userRepo.split('/')[1];
				alert.classList.add(repo, userRepo);
			}
		});

		// Get list of user repos (forks) per repo names.
		var repos = {};
		userRepos.forEach(function(userRepo) {
			var repo = userRepo.split('/')[1];
			if (!repos[repo]) {
				repos[repo] = [];
			}
			repos[repo].push(userRepo);
		});

		// Populate global property.
		Object.keys(repos).forEach(function(repo) {
			if (repos[repo].length === 1) {
				var userRepo = repos[repo][0];
				REPOS.push({ id: userRepo, text: userRepo, link: userRepo, icon: 'octicon-repo', classNames: [userRepo] });
			} else {
				var repoForks = { id: repo, text: repo, icon: 'octicon-repo-clone', classNames: [repo], subFilters: [] };
				repos[repo].forEach(function(userRepo) {
					repoForks.classNames.push(userRepo);
					repoForks.subFilters.push({ id: userRepo, text: userRepo, link: userRepo, icon: 'octicon-repo', classNames: [userRepo] });
				});
				REPOS.push(repoForks);
			}
		});
	}
	// Fix filter user identification.
	function fixUserAlerts(newsContainer) {
		USERS = [{ id: '*-user', text: 'All users', icon: 'octicon-organization', classNames: ['*-user'] }];

		var users = new Set();
		Array.prototype.map.call(newsContainer.querySelectorAll(':scope > div > .body'), function(alert) {
			return alert.parentNode;
		}).forEach(function(alert) {
			var usernameElms = alert.querySelectorAll(':scope [data-ga-click*="target:actor"]');
			Array.prototype.find.call(usernameElms, function(usernameElm){
                var username = usernameElm.textContent;
                if (username) {
					alert.classList.add(username);
                    users.add(username);
                    return true;
                }
            });
		});

		[...users].sort(function(a, b) {
			return a.toLowerCase().localeCompare(b.toLowerCase());
		}).forEach(function(username) {
			var user = { id: username, text: username, icon: 'octicon-person', classNames: [username] };
			USERS.push(user);
		});
	}

	// Update filter counts.
	function updateFilterCounts(filterContainer, newsContainer) {
		Array.forEach(filterContainer.querySelectorAll(':scope li.filter-list-item'), function(li) {
			// Count alerts based on other filters.
			var countFiltered = 0;
			var classNames = [li.filterClassNames];
			var selected = document.querySelectorAll(":scope " + filterElement + ' li.filter-list-item.private');
			if (selected.length > 0) {
				Array.prototype.forEach.call(selected, function(item) {
					if (item.parentNode.parentNode !== filterContainer) { // Exclude list item from current filter container.
						classNames.push(item.filterClassNames);
					}
				});
			}
			Array.prototype.map.call(newsContainer.querySelectorAll(':scope > div > .body'), function(alert) {
				return alert.parentNode;
			}).forEach(function(alert) {
				var show = classNames.every(function(cl) { return cl.some(function(c) { return !!~c.indexOf('*') || alert.classList.contains(c); }); });
				if (show) {
					countFiltered++;
				}
			});

			// Count alerts based on current filter.
			var countAll = 0;
			if (!!~li.filterClassNames[0].indexOf('*')) {
				countAll = newsContainer.querySelectorAll(':scope > div > .body').length;
			} else {
				Array.prototype.map.call(newsContainer.querySelectorAll(':scope > div > .body'), function(alert) {
					return alert.parentNode;
				}).forEach(function(alert) {
					if (li.filterClassNames.some(function(cl) { return alert.classList.contains(cl); })) {
						countAll++;
					}
				});
			}

			li.querySelector(':scope .count').textContent = countAll + ' (' + countFiltered + ')';
		});
	}

	var CURRENT = {};

	// Set current filter.
	function setCurrentFilter(type, filter) {
		CURRENT[type] = filter;
	}

	// Get current filter.
	function getCurrentFilter(type, filterContainer) {
		var filter = CURRENT[type] || '*-' + type;
		filterContainer.querySelector(':scope [' + datasetIdLong + '="' + filter + '"]').dispatchEvent(new Event('click'));
	}

	// Add filter tab.
	function addFilterTab(type, text, inner, filterer, onCreate, onSelect) {
		var filterTab = document.createElement('li');
		filterer.appendChild(filterTab);
		var filterTabInner = document.createElement('a');
		filterTabInner.setAttribute('href', '#');
		filterTabInner.classList.add('repo-filter', 'js-repo-filter-tab');
		filterTabInner.appendChild(document.createTextNode(text));
		filterTab.appendChild(filterTabInner);

		var filterContainer = document.createElement(filterListElement);
		inner.appendChild(filterContainer);

		filterTabInner.addEventListener('click', proxy(filterTabInnerClick, type, inner, filterContainer, onSelect));

		onCreate && onCreate(type, filterContainer);
	}

	// Filter tab click event.
	function filterTabInnerClick(e, type, inner, filterContainer, onSelect) {
		e.preventDefault();

		var selected = inner.querySelector(':scope .filter-selected');
		selected && selected.classList.remove('filter-selected');
		this.classList.add('filter-selected');

		Array.forEach(inner.querySelectorAll(filterListElement), function(menu) {
			menu && menu.classList.remove('open');
		});
		filterContainer.classList.add('open');

		onSelect && onSelect(type, filterContainer);
	}

	// Init.
	(function init() {
		var newsContainer = document.querySelector('.news');
		if (!newsContainer) { return; }

		// GitHub homepage or profile activity tab.
		var sidebar = document.querySelector('.dashboard-sidebar') || document.querySelector('.profilecols > .column:first-child');

		var wrapper = document.createElement(filterElement);
		wrapper.classList.add('boxed-group', 'flush', 'user-repos');
		sidebar.insertBefore(wrapper, sidebar.firstChild);

		var headerAction = document.createElement('div');
		headerAction.classList.add('boxed-group-action');
		wrapper.appendChild(headerAction);

		var headerLink = document.createElement('a');
		headerLink.setAttribute('href', 'https://github.com/jerone/UserScripts');
		headerLink.classList.add('btn', 'btn-sm');
		headerAction.appendChild(headerLink);

		var headerLinkSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		headerLinkSvg.classList.add('octicon', 'octicon-home');
		headerLinkSvg.setAttribute('height', '16');
		headerLinkSvg.setAttribute('width', '16');
		headerLinkSvg.setAttribute('title', 'Open Github News Feed Filter homepage');
		headerLink.appendChild(headerLinkSvg);
		var headerLinkPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		headerLinkPath.setAttribute('d', ICONS['octicon-home']);
		headerLinkSvg.appendChild(headerLinkPath);

		var headerText = document.createElement('h3');
		headerText.appendChild(document.createTextNode('News feed filter'));
		wrapper.appendChild(headerText);

		var inner = document.createElement('div');
		inner.classList.add('boxed-group-inner');
		wrapper.appendChild(inner);

		var bar = document.createElement('div');
		bar.classList.add('filter-repos', 'filter-bar');
		inner.appendChild(bar);

		var filterer = document.createElement('ul');
		filterer.classList.add('repo-filterer');
		bar.appendChild(filterer);

		// Create filter tabs.
		addFilterTab('action', 'Actions', inner, filterer, function onCreateActions(type, filterContainer) {
			// Create filter menu.
			addFilterMenu(type, ACTIONS, filterContainer, newsContainer, filterContainer, true);
		}, function onSelectActions(type, filterContainer) {
			// Fix alert identification.
			fixActionAlerts(newsContainer);
			// Update filter counts.
			updateFilterCounts(filterContainer, newsContainer);
			// Restore current filter.
			getCurrentFilter(type, filterContainer);
		});
		addFilterTab('repo', 'Repositories', inner, filterer, function onCreateRepos(type, filterContainer) {
			// Fix filter identification and create repos list.
			fixRepoAlerts(newsContainer);
			// Create filter menu.
			addFilterMenu(type, REPOS, filterContainer, newsContainer, filterContainer, true);
		}, function onSelectRepos(type, filterContainer) {
			// Fix alert identification and create repos list.
			fixRepoAlerts(newsContainer);
			// Empty list, so it can be filled again.
			while (filterContainer.hasChildNodes()) {
				filterContainer.removeChild(filterContainer.lastChild);
			}
			// Create filter menu.
			addFilterMenu(type, REPOS, filterContainer, newsContainer, filterContainer, true);
			// Update filter counts.
			updateFilterCounts(filterContainer, newsContainer);
			// Restore current filter.
			getCurrentFilter(type, filterContainer);
		});
		addFilterTab('user', 'Users', inner, filterer, function onCreateUsers(type, filterContainer) {
			// Fix filter identification and create users list.
			fixUserAlerts(newsContainer);
			// Create filter menu.
			addFilterMenu(type, USERS, filterContainer, newsContainer, filterContainer, true);
		}, function onSelectUsers(type, filterContainer) {
			// Fix filter identification and create users list.
			fixUserAlerts(newsContainer);
			// Empty list, so it can be filled again.
			while (filterContainer.hasChildNodes()) {
				filterContainer.removeChild(filterContainer.lastChild);
			}
			// Create filter menu.
			addFilterMenu(type, USERS, filterContainer, newsContainer, filterContainer, true);
			// Update filter counts.
			updateFilterCounts(filterContainer, newsContainer);
			// Restore current filter.
			getCurrentFilter(type, filterContainer);
		});

		// Open first filter tab.
		filterer.querySelector('a').dispatchEvent(new Event('click'));

		// Update on clicking "More"-button.
		new MutationObserver(function() {
			// Re-click the current selected filter on open filter tab.
			filterer.querySelector('a.filter-selected').dispatchEvent(new Event('click'));
		}).observe(newsContainer, { childList: true });
	})();

})();
