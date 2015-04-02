// ==UserScript==
// @id          Github_User_Info@https://github.com/jerone/UserScripts
// @name        Github User Info
// @namespace   https://github.com/jerone/UserScripts
// @description Show inline user information on avatar hover.
// @author      jerone
// @copyright   2015+, jerone (http://jeroenvanwarmerdam.nl)
// @license     GNU GPLv3
// @homepage    https://github.com/jerone/UserScripts/tree/master/Github_User_Info
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Github_User_Info
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Github_User_Info/Github_User_Info.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Github_User_Info/Github_User_Info.user.js
// @supportURL  https://github.com/jerone/UserScripts/issues
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @version     0.1.0
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @run-at      document-end
// @include     https://github.com/*
// ==/UserScript==

(function() {

	function proxy(fn) {
		return function() {
			var that = this;
			return function(e) {
				var args = that.slice(0); // clone;
				args.unshift(e); // prepend event;
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
		'width: 320px;' +
		'z-index: 99;';
	userMenu.classList.add('GithubUserInfo');
	userMenu.addEventListener('mouseleave', function() {
		console.log('GithubUserInfo:userMenu', 'mouseleave');
		window.clearTimeout(_timer);
		userMenu.style.display = 'none';
	});
	document.body.appendChild(userMenu);


	var userAvatar = document.createElement('a');
	userAvatar.style =
		'width: 96px;' +
		'height: 96px;' +
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
		'padding-left: 96px;';
	userMenu.appendChild(userInfo);

	var userName = document.createElement('strong');
	userName.style =
		'padding-left: 24px;' +
		'white-space: nowrap;' +
		'overflow: hidden;' +
		'text-overflow: ellipsis;';
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
	var userLocationText = document.createElement('span');
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
	userJoined.appendChild(document.createTextNode('Joined on '));
	var userJoinedText = unsafeWindow.document.createElement('time');
	userJoinedText.setAttribute('day', 'numeric');
	userJoinedText.setAttribute('is', 'local-time');
	userJoinedText.setAttribute('month', 'short');
	userJoinedText.setAttribute('year', 'numeric');
	userJoined.appendChild(userJoinedText);


	var userCounts = document.createElement('div');
	userCounts.style =
		'text-align: center;' +
		'border-top: 1px solid #EEE;' +
		'padding-top: 5px;' +
		'margin-top: 10px;' +
		'clear: left;';
	userMenu.appendChild(userCounts);

	var userFollowers = document.createElement('a');
	userFollowers.style =
		'display: none;' +
		'float: left;' +
		'width: 20%;' +
		'text-decoration: none;';
	userFollowers.classList.add('vcard-stat');
	userFollowers.setAttribute('target', '_blank');
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
		'float: left;' +
		'width: 20%;' +
		'text-decoration: none;';
	userFollowing.classList.add('vcard-stat');
	userFollowing.setAttribute('target', '_blank');
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
		'float: left;' +
		'width: 20%;' +
		'text-decoration: none;';
	userRepos.classList.add('vcard-stat');
	userRepos.setAttribute('target', '_blank');
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
		'float: left;' +
		'width: 20%;' +
		'text-decoration: none;';
	userOrgs.classList.add('vcard-stat');
	userOrgs.setAttribute('target', '_blank');
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

	var userGists = document.createElement('a');
	userGists.style =
		'display: none;' +
		'float: left;' +
		'width: 20%;' +
		'text-decoration: none;';
	userGists.classList.add('vcard-stat');
	userGists.setAttribute('target', '_blank');
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
		var username = elm.getAttribute('alt').replace('@', '');
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
				now = new Date();
			if (date > now.setDate(now.getDate() - UPDATE_INTERVAL_DAYS)) {
				console.log('GithubUserInfo:getData', 'CACHED');
				fillData(users[username].data, position, avatarSize);
			} else {
				console.log('GithubUserInfo:getData', 'AJAX - OUTDATED');
				fetchData(username, position, avatarSize);
			}
		} else {
			console.log('GithubUserInfo:getData', 'AJAX - NON-EXISTING');
			fetchData(username, position, avatarSize);
		}
	}

	function fetchData(username, position, avatarSize) {
		console.log('GithubUserInfo:fetchData', username);
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
		var dataNormalized = normalizeData(dataParsed);
		console.log('GithubUserInfo:parseUserData', dataNormalized.username);

		GM_xmlhttpRequest({
			method: 'GET',
			url: 'https://api.github.com/users/' + dataNormalized.username + '/orgs',
			onload: proxy(parseOrgsData, position, avatarSize, dataNormalized)
		});
	}

	function parseOrgsData(response, position, avatarSize, dataNormalized) {
		var dataParsed = parseRawData(response.responseText);
		if (!dataParsed) {
			return;
		}
		dataNormalized.orgs = dataParsed.length;
		console.log('GithubUserInfo:parseOrgsData', dataNormalized.username, dataNormalized.orgs);

		fillData(dataNormalized, position, avatarSize);
		setData(dataNormalized, dataNormalized.username);
	}

	function parseRawData(data) {
		data = JSON.parse(data);
		if (data.message && data.message.startsWith('API rate limit exceeded')) {
			console.log('GithubUserInfo:parseRawData', 'API RATE LIMIT EXCEEDED');
			return;
		}
		return data;
	}

	function normalizeData(data) {
		return {
			'username': data.login,
			'avatar': data.avatar_url,
			'type': data.type,
			'name': data.name || data.login,
			'company': data.company,
			'blog': data.blog,
			'location': data.location,
			'mail': data.email,
			'repos': data.public_repos,
			'gists': data.public_gists,
			'followers': data.followers,
			'following': data.following,
			'created_at': data.created_at,
			'orgs': 0 // This will be filled via another AJAX call;
		};
	}

	function setData(data, username) {
		var usersString = GM_getValue('users', '{}');
		var users = JSON.parse(usersString);
		if (!users[username]) {
			users[username] = {
				checked_at: (new Date()).toJSON(),
				data: data
			};
		}
		GM_setValue('users', JSON.stringify(users));
	}

	function fillData(data, position, avatarSize) {
		userMenu.style.top = Math.max(position.top - 10 - 1, 2) + 'px';
		userMenu.style.left = Math.max(position.left - 10 - 1, 2) + 'px';
		userMenu.style.display = 'block';

		userAvatar.setAttribute('href', 'https://github.com/' + data.username);
		userAvatarImg.style.height = avatarSize.height + 'px';
		userAvatarImg.style.width = avatarSize.width + 'px';
		window.setTimeout(function() {
			userAvatarImg.style.height = '96px';
			userAvatarImg.style.width = '96px';
		}, 50);
		userAvatarImg.setAttribute('src', '');
		userAvatarImg.setAttribute('src', data.avatar);

		userName.setAttribute('title', data.username);
		userName.textContent = data.name;

		if (hasValue(data.company, userCompany)) {
			userCompanyText.textContent = data.company;
		}
		if (hasValue(data.location, userLocation)) {
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
			userJoinedText.textContent = data.created_at;
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
		if (hasValue(data.repos, userRepos)) {
			userCountsHasValue = true;
			userRepos.setAttribute('href', 'https://github.com/' + data.username + '?tab=repositories');
			userReposCount.textContent = data.repos;
		}
		if (hasValue(data.orgs, userOrgs)) {
			userCountsHasValue = true;
			userOrgs.setAttribute('href', 'https://github.com/' + data.username);
			userOrgsCount.textContent = data.orgs;
		}
		if (hasValue(data.gists, userGists)) {
			userCountsHasValue = true;
			userGists.setAttribute('href', 'https://gist.github.com/' + data.username);
			userGistsCount.textContent = data.gists;
		}
		userCounts.style.display = userCountsHasValue ? 'block' : 'none';

		//if (data.type === 'Organization' || data.type === 'User') {}
	}

	function hasValue(property, elm) {
		elm.style.display = property ? 'block' : 'none';
		return !!property;
	}


	function init() {
		var avatars = document.querySelectorAll('.avatar[alt^="@"], .gravatar[alt^="@"], .timeline-comment-avatar[alt^="@"]');
		Array.prototype.forEach.call(avatars, function(avatar) {
			avatar.addEventListener('mouseenter', function() {
				console.log('GithubUserInfo:avatar', 'mouseenter');
				_timer = window.setTimeout(function() {
					console.log('GithubUserInfo:avatar', 'timeout');
					getData(this);
				}.bind(this), 500);
			});
			avatar.addEventListener('mouseleave', function() {
				console.log('GithubUserInfo:avatar', 'mouseleave');
				window.clearTimeout(_timer);
			});
		});
	}

	// Page load;
	console.log('GithubUserInfo', 'page load');
	init();

	// On pjax;
	unsafeWindow.$(document).on("pjax:end", exportFunction(function() {
		console.log('GithubUserInfo', 'pjax');
		init();
	}, unsafeWindow));

})();
