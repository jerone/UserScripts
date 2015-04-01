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
// @run-at      document-end
// @include     https://github.com/*
// ==/UserScript==

(function() {

	var userMenu = document.createElement('div');
	userMenu.style =
		'display: none;' +
		'border-radius: 3px;' +
		'border: 1px solid #DDDDDD;' +
		'background-color: #F5F5F5;' +
		'padding: 10px;' +
		'position: absolute;' +
		'box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);' +
		'width: 320px;' +
		'font-size: 11px;';
	userMenu.classList.add('GithubUserInfo');
	userMenu.addEventListener('mouseleave', function() {
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
	userAvatarImg.style = 'border-radius: 3px;';
	userAvatarImg.width = '96';
	userAvatarImg.height = '96';
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
		'width: 25%;' +
		'font-size: 11px;' +
		'text-decoration: none;';
	userFollowers.setAttribute('target', '_blank');
	userCounts.appendChild(userFollowers);
	var userFollowersCount = document.createElement('strong');
	userFollowersCount.style =
		'display:block;' +
		'font-size: 28px;';
	userFollowers.appendChild(userFollowersCount);
	var userFollowersText = document.createElement('span');
	userFollowersText.appendChild(document.createTextNode('Followers'));
	userFollowersText.style = 'color: #999;';
	userFollowers.appendChild(userFollowersText);

	var userFollowing = document.createElement('a');
	userFollowing.style =
		'display: none;' +
		'float: left;' +
		'width: 25%;' +
		'text-decoration: none;';
	userFollowing.setAttribute('target', '_blank');
	userCounts.appendChild(userFollowing);
	var userFollowingCount = document.createElement('strong');
	userFollowingCount.style =
		'display:block;' +
		'font-size: 28px;';
	userFollowing.appendChild(userFollowingCount);
	var userFollowingText = document.createElement('span');
	userFollowingText.appendChild(document.createTextNode('Following'));
	userFollowingText.style = 'color: #999;';
	userFollowing.appendChild(userFollowingText);

	var userRepos = document.createElement('a');
	userRepos.style =
		'display: none;' +
		'float: left;' +
		'width: 25%;' +
		'text-decoration: none;';
	userRepos.setAttribute('target', '_blank');
	userCounts.appendChild(userRepos);
	var userReposCount = document.createElement('strong');
	userReposCount.style =
		'display:block;' +
		'font-size: 28px;';
	userRepos.appendChild(userReposCount);
	var userReposText = document.createElement('span');
	userReposText.appendChild(document.createTextNode('Repos'));
	userReposText.style = 'color: #999;';
	userRepos.appendChild(userReposText);

	var userGists = document.createElement('a');
	userGists.style =
		'display: none;' +
		'float: left;' +
		'width: 25%;' +
		'text-decoration: none;';
	userGists.setAttribute('target', '_blank');
	userCounts.appendChild(userGists);
	var userGistsCount = document.createElement('strong');
	userGistsCount.style =
		'display:block;' +
		'font-size: 28px;';
	userGists.appendChild(userGistsCount);
	var userGistsText = document.createElement('span');
	userGistsText.appendChild(document.createTextNode('Gists'));
	userGistsText.style = 'color: #999;';
	userGists.appendChild(userGistsText);



	var avatars = document.querySelectorAll('.avatar[alt^="@"], .timeline-comment-avatar[alt^="@"]');
	Array.prototype.forEach.call(avatars, function(avatar) {
		avatar.addEventListener('mouseenter', function() {
			getData(this);
		});
	});

	var UPDATE_INTERVAL_DAYS = 7;

	function getData(elm) {
		var userName = elm.getAttribute('alt').replace('@', '');
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
		if (users[userName]) {
			var date = new Date(users[userName].checked_at),
				now = new Date();
			if (date > now.setDate(now.getDate() - UPDATE_INTERVAL_DAYS)) {
				console.log('GithubUserInfo:getData', 'CACHED');
				fillData(users[userName].data, position, avatarSize);
			} else {
				console.log('GithubUserInfo:getData', 'AJAX - OUTDATED');
				fetchData(userName, position, avatarSize);
			}
		} else {
			console.log('GithubUserInfo:getData', 'AJAX - NON-EXISTING');
			fetchData(userName, position, avatarSize);
		}
	}

	function fetchData(userName, position, avatarSize) {
		GM_xmlhttpRequest({
			method: 'GET',
			url: 'https://api.github.com/users/' + userName,
			onload: function(response) {
				var dataRaw = JSON.parse(response.responseText);
				if (dataRaw.message && dataRaw.message.startsWith('API rate limit exceeded')) {
					console.log('GithubUserInfo:fetchData', 'API RATE LIMIT EXCEEDED');
					return;
				}
				var dataNormalized = normalizeData(dataRaw);
				fillData(dataNormalized, position, avatarSize);
				setData(dataNormalized, userName);
			}
		});
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
			'created_at': data.created_at
		};
	}

	function setData(data, userName) {
		var usersString = GM_getValue('users', '{}');
		var users = JSON.parse(usersString);
		if (!users[userName]) {
			users[userName] = {
				checked_at: (new Date()).toJSON(),
				data: data
			};
		}
		GM_setValue('users', JSON.stringify(users));
	}

	function fillData(data, position, avatarSize) {
		userAvatar.setAttribute('href', 'https://github.com/' + data.username);
		//userAvatarImg.height = avatarSize.height;
		//userAvatarImg.width = avatarSize.width;
		userAvatarImg.setAttribute('src', '');
		userAvatarImg.setAttribute('src', data.avatar);

		userName.setAttribute('title', data.username);
		userName.textContent = data.name || data.username;

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
		if (hasValue(data.gists, userGists)) {
			userCountsHasValue = true;
			userGists.setAttribute('href', 'https://gist.github.com/' + data.username);
			userGistsCount.textContent = data.gists;
		}
		userCounts.style.display = userCountsHasValue ? 'block' : 'none';

		//if (data.type === 'Organization' || data.type === 'User') {}

		userMenu.style.top = Math.max(position.top - 10 - 1, 2) + 'px';
		userMenu.style.left = Math.max(position.left - 10 - 1, 2) + 'px';
		userMenu.style.display = 'block';
	}

	function hasValue(property, elm) {
		elm.style.display = property ? 'block' : 'none';
		return !!property;
	}

})();
