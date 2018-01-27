// ==UserScript==
// @id          Github_User_Info@https://github.com/jerone/UserScripts
// @name        Github User Info
// @namespace   https://github.com/jerone/UserScripts
// @description Show inline user information on avatar hover.
// @author      jerone
// @copyright   2015+, jerone (http://jeroenvanwarmerdam.nl)
// @license     GPL-3.0
// @homepage    https://github.com/jerone/UserScripts/tree/master/Github_User_Info
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Github_User_Info
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Github_User_Info/Github_User_Info.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Github_User_Info/Github_User_Info.user.js
// @supportURL  https://github.com/jerone/UserScripts/issues
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @icon        https://github.com/fluidicon.png
// @version     0.4.0
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @run-at      document-end
// @include     https://github.com/*
// @include     https://gist.github.com/*
// ==/UserScript==

(function() {

	function proxy(fn) {
		return function proxyScope() {
			var that = this;
			return function proxyEvent(e) {
				var args = that.slice(0); // clone
				args.unshift(e); // prepend event
				fn.apply(this, args);
			};
		}.call([].slice.call(arguments, 1));
	}

	var _timer;

	var userMenu = document.createElement('div');
	userMenu.style =
		'display: none;' +
		'background-color: #F5F5F5;' +
		'border-radius: 3px;' +
		'border: 1px solid #DDDDDD;' +
		'box-shadow: 0 0 10px rgba(0, 0, 1, 0.1);' +
		'font-size: 11px;' +
		'padding: 10px;' +
		'position: absolute;' +
		'width: 335px;' +
		'z-index: 99;';
	userMenu.classList.add('GithubUserInfo');
	userMenu.addEventListener('mouseleave', function mouseleave() {
		// console.log('GithubUserInfo:userMenu', 'mouseleave');
		window.clearTimeout(_timer);
		userMenu.style.display = 'none';
	});
	document.body.appendChild(userMenu);


	var userAvatar = document.createElement('a');
	userAvatar.style =
		'width: 100px;' +
		'height: 100px;' +
		'float: left;' +
		'margin-bottom: 10px;';
	userMenu.appendChild(userAvatar);
	var userAvatarImg = document.createElement('img');
	userAvatarImg.style =
		'border-radius: 3px;' +
		'transition-property: height, width;' +
		'transition-duration: 0.5s;';
	userAvatar.appendChild(userAvatarImg);


	var userInfo = document.createElement('div');
	userInfo.style =
		'width: 100%;' +
		'padding-left: 102px;';
	userMenu.appendChild(userInfo);

	var userName = document.createElement('div');
	userName.style =
		'padding-left: 24px;' +
		'white-space: nowrap;' +
		'overflow: hidden;' +
		'text-overflow: ellipsis;' +
		'font-weight: bold;';
	userInfo.appendChild(userName);

	var userCompany = document.createElement('div');
	userCompany.style =
		'display: none;' +
		'white-space: nowrap;' +
		'overflow: hidden;' +
		'text-overflow: ellipsis;';
	userInfo.appendChild(userCompany);
	var userCompanyIcon = document.createElement('span');
	userCompanyIcon.classList.add('octicon', 'octicon-organization');
	userCompanyIcon.style =
		'width: 24px;' +
		'text-align: center;' +
		'color: #CCC;';
	userCompany.appendChild(userCompanyIcon);
	var userCompanyText = document.createElement('span');
	userCompany.appendChild(userCompanyText);
	var userCompanyAdmin = document.createElement('span');
	userCompanyAdmin.style =
		'display: none;' +
		'margin-left: 5px;' +
		'position: relative;' +
		'top: -1px;' +
		'padding: 2px 5px;' +
		'font-size: 10px;' +
		'font-weight: bold;' +
		'color: #FFF;' +
		'text-transform: uppercase;' +
		'background-color: #4183C4;' +
		'border-radius: 3px;';
	userCompanyAdmin.appendChild(document.createTextNode('Staff'));
	userCompany.appendChild(userCompanyAdmin);

	var userLocation = document.createElement('div');
	userLocation.style =
		'display: none;' +
		'white-space: nowrap;' +
		'overflow: hidden;' +
		'text-overflow: ellipsis;';
	userInfo.appendChild(userLocation);
	var userLocationIcon = document.createElement('span');
	userLocationIcon.classList.add('octicon', 'octicon-location');
	userLocationIcon.style =
		'width: 24px;' +
		'text-align: center;' +
		'color: #CCC;';
	userLocation.appendChild(userLocationIcon);
	var userLocationText = document.createElement('a');
	userLocationText.setAttribute('target', '_blank');
	userLocation.appendChild(userLocationText);

	var userMail = document.createElement('div');
	userMail.style =
		'display: none;' +
		'white-space: nowrap;' +
		'overflow: hidden;' +
		'text-overflow: ellipsis;';
	userInfo.appendChild(userMail);
	var userMailIcon = document.createElement('span');
	userMailIcon.classList.add('octicon', 'octicon-mail');
	userMailIcon.style =
		'width: 24px;' +
		'text-align: center;' +
		'color: #CCC;';
	userMail.appendChild(userMailIcon);
	var userMailText = document.createElement('a');
	userMail.appendChild(userMailText);

	var userLink = document.createElement('div');
	userLink.style =
		'display: none;' +
		'white-space: nowrap;' +
		'overflow: hidden;' +
		'text-overflow: ellipsis;';
	userInfo.appendChild(userLink);
	var userLinkIcon = document.createElement('span');
	userLinkIcon.classList.add('octicon', 'octicon-link');
	userLinkIcon.style =
		'width: 24px;' +
		'text-align: center;' +
		'color: #CCC;';
	userLink.appendChild(userLinkIcon);
	var userLinkText = document.createElement('a');
	userLinkText.setAttribute('target', '_blank');
	userLink.appendChild(userLinkText);

	var userJoined = document.createElement('div');
	userJoined.style =
		'display: none;' +
		'white-space: nowrap;' +
		'overflow: hidden;' +
		'text-overflow: ellipsis;';
	userInfo.appendChild(userJoined);
	var userJoinedIcon = document.createElement('span');
	userJoinedIcon.classList.add('octicon', 'octicon-clock');
	userJoinedIcon.style =
		'width: 24px;' +
		'text-align: center;' +
		'color: #CCC;';
	userJoined.appendChild(userJoinedIcon);
	userJoined.appendChild(document.createTextNode('Joined '));
	var userJoinedText = unsafeWindow.document.createElement('relative-time'); // https://github.com/github/time-elements
	userJoinedText.setAttribute('day', 'numeric');
	userJoinedText.setAttribute('month', 'short');
	userJoinedText.setAttribute('year', 'numeric');
	userJoined.appendChild(userJoinedText);


	var userCounts = document.createElement('div');
	userCounts.style =
		'border-top: 1px solid #EEE;' +
		'clear: left;' +
		'display: flex;' +
		'justify-content: space-around;' +
		'text-align: center;' +
		'white-space: nowrap;';
	userMenu.appendChild(userCounts);

	var userFollowers = document.createElement('a');
	userFollowers.style =
		'display: none;' +
		'text-decoration: none;';
	userFollowers.classList.add('vcard-stat');
	userFollowers.setAttribute('target', '_blank');
	userFollowers.setAttribute('title', 'Followers');
	userCounts.appendChild(userFollowers);
	var userFollowersCount = document.createElement('strong');
	userFollowersCount.style =
		'display: block;' +
		'font-size: 28px;';
	userFollowers.appendChild(userFollowersCount);
	var userFollowersText = document.createElement('span');
	userFollowersText.appendChild(document.createTextNode('Followers'));
	userFollowersText.classList.add('text-muted');
	userFollowers.appendChild(userFollowersText);

	var userFollowing = document.createElement('a');
	userFollowing.style =
		'display: none;' +
		'text-decoration: none;';
	userFollowing.classList.add('vcard-stat');
	userFollowing.setAttribute('target', '_blank');
	userFollowing.setAttribute('title', 'Following');
	userCounts.appendChild(userFollowing);
	var userFollowingCount = document.createElement('strong');
	userFollowingCount.style =
		'display: block;' +
		'font-size: 28px;';
	userFollowing.appendChild(userFollowingCount);
	var userFollowingText = document.createElement('span');
	userFollowingText.appendChild(document.createTextNode('Following'));
	userFollowingText.classList.add('text-muted');
	userFollowing.appendChild(userFollowingText);

	var userRepos = document.createElement('a');
	userRepos.style =
		'display: none;' +
		'text-decoration: none;';
	userRepos.classList.add('vcard-stat');
	userRepos.setAttribute('target', '_blank');
	userRepos.setAttribute('title', 'Public repositories');
	userCounts.appendChild(userRepos);
	var userReposCount = document.createElement('strong');
	userReposCount.style =
		'display: block;' +
		'font-size: 28px;';
	userRepos.appendChild(userReposCount);
	var userReposText = document.createElement('span');
	userReposText.appendChild(document.createTextNode('Repos'));
	userReposText.classList.add('text-muted');
	userRepos.appendChild(userReposText);

	var userOrgs = document.createElement('a');
	userOrgs.style =
		'display: none;' +
		'text-decoration: none;';
	userOrgs.classList.add('vcard-stat');
	userOrgs.setAttribute('target', '_blank');
	userOrgs.setAttribute('title', 'Public organisations');
	userCounts.appendChild(userOrgs);
	var userOrgsCount = document.createElement('strong');
	userOrgsCount.style =
		'display: block;' +
		'font-size: 28px;';
	userOrgs.appendChild(userOrgsCount);
	var userOrgsText = document.createElement('span');
	userOrgsText.appendChild(document.createTextNode('Orgs'));
	userOrgsText.classList.add('text-muted');
	userOrgs.appendChild(userOrgsText);

	var userMembers = document.createElement('a');
	userMembers.style =
		'display: none;' +
		'text-decoration: none;';
	userMembers.classList.add('vcard-stat');
	userMembers.setAttribute('target', '_blank');
	userMembers.setAttribute('title', 'Public members');
	userCounts.appendChild(userMembers);
	var userMembersCount = document.createElement('strong');
	userMembersCount.style =
		'display: block;' +
		'font-size: 28px;';
	userMembers.appendChild(userMembersCount);
	var userMembersText = document.createElement('span');
	userMembersText.appendChild(document.createTextNode('Members'));
	userMembersText.classList.add('text-muted');
	userMembers.appendChild(userMembersText);

	var userGists = document.createElement('a');
	userGists.style =
		'display: none;' +
		'text-decoration: none;';
	userGists.classList.add('vcard-stat');
	userGists.setAttribute('target', '_blank');
	userGists.setAttribute('title', 'Public gists');
	userCounts.appendChild(userGists);
	var userGistsCount = document.createElement('strong');
	userGistsCount.style =
		'display: block;' +
		'font-size: 28px;';
	userGists.appendChild(userGistsCount);
	var userGistsText = document.createElement('span');
	userGistsText.appendChild(document.createTextNode('Gists'));
	userGistsText.classList.add('text-muted');
	userGists.appendChild(userGistsText);


	var UPDATE_INTERVAL_DAYS = 7;

	function getData(elm) {
		var username;
		if (elm.getAttribute('alt')) {
			username = elm.getAttribute('alt').replace('@', '');
		} else if (elm.parentNode.parentNode.querySelector('.author')) {
			username = elm.parentNode.parentNode.querySelector('.author').textContent.trim();
		} else {
			return;
		}

		var rect = elm.getBoundingClientRect();
		var position = {
			top: rect.top + window.scrollY,
			left: rect.left + window.scrollX
		};
		var avatarSize = {
			height: elm.height,
			width: elm.width
		};

		var usersString = GM_getValue('users', '{}');
		var users = JSON.parse(usersString);
		if (users[username]) {
			var date = new Date(users[username].checked_at),
				now = new Date(),
				upDate = new Date(now.setDate(now.getDate() - UPDATE_INTERVAL_DAYS));
			if (date > upDate) {
				var data = users[username].data;
				// console.log('GithubUserInfo:getData', 'CACHED', data);
				fillData(defaultData(data), position, avatarSize);
			} else {
				// console.log('GithubUserInfo:getData', 'AJAX - OUTDATED', username, date, upDate);
				fetchData(username, position, avatarSize);
			}
		} else {
			// console.log('GithubUserInfo:getData', 'AJAX - NON-EXISTING', username);
			fetchData(username, position, avatarSize);
		}
	}

	function fetchData(username, position, avatarSize) {
		// console.log('GithubUserInfo:fetchData', username);
		GM_xmlhttpRequest({
			method: 'GET',
			url: 'https://api.github.com/users/' + username,
			onload: proxy(parseUserData, position, avatarSize)
		});
	}

	function parseUserData(response, position, avatarSize) {
		var dataParsed = parseRawData(response.responseText);
		if (!dataParsed) {
			return;
		}
		var data = defaultData(normalizeData(dataParsed));
		// console.log('GithubUserInfo:parseUserData', data.username);

		GM_xmlhttpRequest({
			method: 'GET',
			url: 'https://api.github.com/users/' + data.username + '/orgs',
			onload: proxy(parseOrgsData, position, avatarSize, data)
		});
	}

	function parseOrgsData(response, position, avatarSize, data) {
		var dataParsed = parseRawData(response.responseText);
		if (!dataParsed) {
			return;
		}
		data.orgs = dataParsed.length;
		// console.log('GithubUserInfo:parseOrgsData', data.username, data.orgs);

		switch (data.type) {
			case 'Organization':
				{
					GM_xmlhttpRequest({
						method: 'GET',
						url: 'https://api.github.com/orgs/' + data.username + '/members',
						onload: proxy(parseMembersData, position, avatarSize, data)
					});
					break;
				}
			default:
				{
					fillData(data, position, avatarSize);
					setData(data, data.username);
					break;
				}
		}
	}

	function parseMembersData(response, position, avatarSize, data) {
		var dataParsed = parseRawData(response.responseText);
		if (!dataParsed) {
			return;
		}
		data.members = dataParsed.length;
		// console.log('GithubUserInfo:parseMembersData', data.username, data.members);

		fillData(data, position, avatarSize);
		setData(data, data.username);
	}

	function parseRawData(data) {
		data = JSON.parse(data);
		if (data.message && data.message.startsWith('API rate limit exceeded')) {
			console.warn('GithubUserInfo:parseRawData', 'API RATE LIMIT EXCEEDED');
			return;
		}
		return data;
	}

	function normalizeData(data) {
		return {
			'username': data.login,
			'avatar': data.avatar_url,
			'type': data.type,
			'name': data.name,
			'company': data.company,
			'blog': data.blog,
			'location': data.location,
			'mail': data.email,
			'repos': data.public_repos,
			'gists': data.public_gists,
			'followers': data.followers,
			'following': data.following,
			'created_at': data.created_at,
			'admin': !!data.site_admin
		};
	}

	function defaultData(data) {
		return {
			'username': data.username,
			'avatar': data.avatar,
			'type': data.type,
			'name': data.name || data.username,
			'company': data.admin ? 'GitHub' : data.company || '',
			'blog': data.blog || '',
			'location': data.location || '',
			'mail': data.mail || '',
			'repos': data.repos || 0,
			'gists': data.gists || 0,
			'followers': data.followers || 0,
			'following': data.following || 0,
			'created_at': data.created_at,
			'admin': data.admin || false,
			'orgs': data.orgs || 0,
			'members': data.members || 0
		};
	}

	function setData(data, username) {
		// console.log('GithubUserInfo:setData', username, data);
		var usersString = GM_getValue('users', '{}');
		var users = JSON.parse(usersString);
		users[username] = {
			checked_at: (new Date()).toJSON(),
			data: data
		};
		GM_setValue('users', JSON.stringify(users));
	}

	function fillData(data, position, avatarSize) {
		// console.log('GithubUserInfo:fillData', data, position, avatarSize);

		userAvatar.setAttribute('href', 'https://github.com/' + data.username);
		userAvatarImg.style.height = avatarSize.height + 'px';
		userAvatarImg.style.width = avatarSize.width + 'px';
		userAvatarImg.addEventListener('load', function() {
			userMenu.style.top = Math.max(position.top - 10 - 1, 2) + 'px';
			userMenu.style.left = Math.max(position.left - 10 - 1, 2) + 'px';
			userMenu.style.display = 'block';
			window.setTimeout(function avatarAnimationTimeout() {
				userAvatarImg.style.height = '100px';
				userAvatarImg.style.width = '100px';
			}, 50);
		});
		userAvatarImg.setAttribute('src', '');
		userAvatarImg.setAttribute('src', data.avatar);

		userName.setAttribute('title', data.username);
		userName.textContent = data.name;

		if (hasValue(data.company, userCompany)) {
			userCompanyText.textContent = data.company;
			userCompanyAdmin.style.display = data.admin ? 'inline' : 'none';
		}
		if (hasValue(data.location, userLocation)) {
			userLocationText.setAttribute('href', 'https://maps.google.com/maps?q=' + encodeURIComponent(data.location));
			userLocationText.textContent = data.location;
		}
		if (hasValue(data.mail, userMail)) {
			userMailText.setAttribute('href', 'mailto:' + data.mail);
			userMailText.textContent = data.mail;
		}
		if (hasValue(data.blog, userLink)) {
			userLinkText.setAttribute('href', data.blog);
			userLinkText.textContent = data.blog;
		}
		if (hasValue(data.created_at, userJoined)) {
			userJoinedText.setAttribute('datetime', data.created_at);
		}

		var userCountsHasValue = false;
		if (hasValue(data.followers, userFollowers)) {
			userCountsHasValue = true;
			userFollowers.setAttribute('href', 'https://github.com/' + data.username + '/followers');
			userFollowersCount.textContent = data.followers;
		}
		if (hasValue(data.following, userFollowing)) {
			userCountsHasValue = true;
			userFollowing.setAttribute('href', 'https://github.com/' + data.username + '/following');
			userFollowingCount.textContent = data.following;
		}
		if (hasValue(true, userRepos)) { // Always show repos count, as long another count is shown too
			userRepos.setAttribute('href', 'https://github.com/' + data.username + '?tab=repositories');
			userReposCount.textContent = data.repos;
		}
		if (hasValue(data.orgs, userOrgs)) {
			userCountsHasValue = true;
			userOrgs.setAttribute('href', 'https://github.com/' + data.username);
			userOrgsCount.textContent = data.orgs;
		}
		if (hasValue(data.members, userMembers)) {
			userCountsHasValue = true;
			userMembers.setAttribute('href', 'https://github.com/orgs/' + data.username + '/people');
			userMembersCount.textContent = data.members === 30 ? '30+' : data.members;
		}
		if (hasValue(data.gists, userGists)) {
			userCountsHasValue = true;
			userGists.setAttribute('href', 'https://gist.github.com/' + data.username);
			userGistsCount.textContent = data.gists;
		}
		userCounts.style.display = userCountsHasValue ? 'flex' : 'none';

		//if (data.type === 'Organization' || data.type === 'User') {}
	}

	function hasValue(property, elm) {
		elm.style.display = property ? 'block' : 'none';
		return !!property;
	}


	function init() {
		var avatars = document.querySelectorAll([
			'.avatar[alt^="@"]', // Logged-in user & commits author & issuse participant & users organization & organization member
			'.avatar-child[alt^="@"]', // Authored committed users
			'.gravatar[alt^="@"]', // Following & followers page
			'.timeline-comment-avatar[alt^="@"]', // GitHub comments author
			'.commits img[alt^="@"]', // Commits on user activity tab
			'.leaderboard-gravatar[alt^="@"]', // Trending developer: https://github.com/trending/developers
			'.gist-author img', // Gist author
			'.gist .js-discussion .timeline-comment-avatar' // Gist comments author
		].join(','));
		Array.prototype.forEach.call(avatars, function avatarsForEach(avatar) {
			avatar.addEventListener('mouseenter', function mouseenter() {
				// console.log('GithubUserInfo:avatar', 'mouseenter');
				_timer = window.setTimeout(function mouseenterTimer() {
					// console.log('GithubUserInfo:avatar', 'timeout');
					getData(this);
				}.bind(this), 500);
			});
			avatar.addEventListener('mouseleave', function mouseleave() {
				// console.log('GithubUserInfo:avatar', 'mouseleave');
				window.clearTimeout(_timer);
			});
		});
	}

	// Init
	init();

	// Pjax
	document.addEventListener('pjax:end', init);

})();
