// ==UserScript==
// @name        Github Gist Share
// @namespace   https://github.com/jerone/UserScripts/
// @description Share your GitHub Gist to Twitter, Dabblet & as userscript.
// @author      jerone
// @copyright   2014+, jerone (http://jeroenvanwarmerdam.nl)
// @license     GNU GPLv3
// @homepage    https://github.com/jerone/UserScripts/tree/master/Github_Gist_Share
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Github_Gist_Share
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Github_Gist_Share/157850.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Github_Gist_Share/157850.user.js
// @supportURL  https://github.com/jerone/UserScripts/issues
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @include     *://gist.github.com/*
// @version     4.4
// @grant       none
// ==/UserScript==
/* global unsafeWindow */

(function() {

	String.format = function(string) {
		var args = Array.prototype.slice.call(arguments, 1, arguments.length);
		return string.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] !== 'undefined' ? args[number] : match;
		});
	};

	var socials = {
		Twitter: {
			show: function( /*url, user, description, files, stars, forks, revisions*/ ) {
				return true;
			},
			submit: function(url, user, description, files, stars, forks, revisions) {
				var stats = [];
				if (files > 1) {
					stats.push(files + ' files');
				}
				if (stars === 1) {
					stats.push(stars + ' star');
				} else if (stars > 1) {
					stats.push(stars + ' stars');
				}
				if (forks === 1) {
					stats.push(forks + ' fork');
				} else if (forks > 1) {
					stats.push(forks + ' forks');
				}
				if (revisions > 1) {
					stats.push(revisions + ' revisions');
				}

				var tweet = String.format('Check out {0} #gist {1} on @github{2} |',
					user === document.querySelector('.name').textContent.trim() ? 'my' : user + '\'s',
					description ? '"' + description + '"' : '',
					stats.length > 0 ? ' | ' + stats.join(', ') : '');

				return 'https://twitter.com/intent/tweet?original_referer=' + encodeURIComponent(url) +
					'&source=tweetbutton&url=' + encodeURIComponent(url) +
					'&text=' + encodeURIComponent(tweet);
			},
			icon: 'https://si0.twimg.com/favicons/favicon.ico'
		},
		Dabblet: {
			/*
			 * The following urls should be converted to dabblet:
			 *                                   _______
			 *  - https://gist.github.com/jerone/3810309
			 *                                   _______
			 *  - https://gist.github.com/jerone/3810309/revisions
			 *                                   _______
			 *  - https://gist.github.com/jerone/3810309/forks
			 *                                   _______
			 *  - https://gist.github.com/jerone/3810309/stars
			 *                                   ________________________________________________
			 *  - https://gist.github.com/jerone/3810309/f2815cc6796ea985f74b8f5f3c717e8de3b12d37
			 *                            ________________________________________________
			 *  - https://gist.github.com/3810309/f2815cc6796ea985f74b8f5f3c717e8de3b12d37
			 *
			 */
			show: function( /*url, user, description, files, stars, forks, revisions*/ ) {
				return true;
			},
			submit: function(url, user /*, description, files, stars, forks, revisions*/ ) {
				var linkLong;
				if ((linkLong = document.querySelector('.site-container.js-site-container')) && linkLong.dataset.url) {
					var linkLongParts = linkLong.dataset.url.split('/');
					linkLongParts.shift();
					if (/^(?:revisions|forks|stars)$/gi.test(linkLongParts[linkLongParts.length - 1])) {
						linkLongParts.pop();
					}
					if (new RegExp(user, 'gi').test(linkLongParts[0])) {
						linkLongParts.shift();
					}
					url = '/' + linkLongParts.join('/');
				} else {
					url = url.replace(new RegExp('https?:\/\/gist.github.com/' + user, 'gi'), '');
				}
				return 'http://dabblet.com/gist' + url;
			},
			icon: 'http://dabblet.com/favicon.ico'
		},
		UserScript: {
			show: function( /*url, user, description, files, stars, forks, revisions*/ ) {
				return !!document.querySelector('.file[id^="file-"] .raw-url[href$=".user.js"]');
			},
			submit: function( /*url, user, description, files, stars, forks, revisions*/ ) {
				return (document.querySelector('.file[id^="file-"] .raw-url[href$=".user.js"]') || {
					href: ''
				}).href.trim();
			},
			icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKwSURBVHjabJNJTBNRGID/mc5MQYVWVNCGTbEtNZGDBj1ogolEMR5UJA2LBmMoIokxERIj8ehJjx6MYIQoJgq4JIa6gEARkKJFTa2iFFtKWwp2oeDCzNQ+31DQCc5L/nmT/P/3749ACAFBECBxiEPFFds0Ws399DRVhtX2udc97ig0PmgOLBkIbOwjAR8uMRRdvXF7pqv/NfrqnEAOlxsdLas6j3Wk2AEpCRcbKvLydrdu1WUr0lXrITEhAZKUSkhQKvKwXiY2ppbDRzCcv29P/ZZsDaSqUkCJYVJGwKMnHTDlmWgTZ/CvjkW4sKTScP1WC+oZsKAxpwv5gyEUnAkj2xc70p88Y8Y2a8VBxT0gispOGa413UVDb23IMe6OwaEw+jTqQKMOF3pptqBSw7k74hLEPaDUOu0VmpFDV58ZCJIAkiDB5fUBz0eApmjQqbOgrqa69HhVbZO4jKUfmiBJBctysHJFPPiDYbA7J4DjeJDLaWAYGVAyErIy0uDs6RPH9OXVtULWYgfEmN3emJK8BlYrEsHl8cEvloX4ODnEyRlgKGZhV1iOhcz0VNixM7dOCCp2EBkeMF3u6DaNqDasg1U4CzlFxxSRKMyz8xjmsPAQwNmRsc2jxGPkR0esHp7n9RBFrYbyUi1DUzh1GujFG0UBQrNz8P7DR3j+9NklqTEK3VVkbNLkVNZc9AwNW5Hb60PT/gCamg6gEbsT3XvYjvIP6i9gu2ShhOWb+BvLD13O9o3azWrVdy4K3wKhv5HfWW1Q39BY19nechPbzQrVwX9bhU+iIqnyQMF+mPvJQr/FCsHwDJgG30ADhl8Y2wQ4jIUVkpdaZRnPcd6AfxomJ32AIhEwdvaC8XG7JLwwvmXPmVFn52Tu2lvQjN9Crn3M6bWY+6otr3oGpWCB/SPAAJaJRguGUxB0AAAAAElFTkSuQmCC'
		}
	};

	function addMenuItem() {
		var temp, link, url, menu, li, user, description, files, stars, forks, revisions;

		if ((link = document.querySelector('.js-current-repository')) && (menu = document.querySelector('.sunken-menu-group'))) { // check if we're on an actual gists;
			url = link.href;
			user = document.querySelector('.author.vcard').textContent.trim();
			description = (temp = (document.querySelector('.gist-description') || link)) && temp.textContent.trim() || '';
			files = document.querySelectorAll('.file[id^="file-"]').length;
			stars = (temp = menu.querySelector('a[href$="/stars"] .counter')) && parseInt(temp.textContent.trim(), 10) || 0;
			forks = (temp = menu.querySelector('a[href$="/forks"] .counter')) && parseInt(temp.textContent.trim(), 10) || 0;
			revisions = (temp = menu.querySelector('a[href$="/revisions"] .counter')) && parseInt(temp.textContent.trim(), 10) || 0;

			menu.appendChild(li = document.createElement('li'));
			li.id = 'Github_Gist_Share';

			for (var key in socials) {
				if (socials.hasOwnProperty(key)) {
					var social = socials[key],
						socialA = document.createElement('a'),
						socialImg = document.createElement('img');

					if (social.show(url, user, description, files, stars, forks, revisions) !== true) {
						continue;
					}

					li.appendChild(socialA);
					socialA.appendChild(socialImg);
					socialA.id = (li.id + '_' + key).replace(/\s+/g, '_');
					socialA.classList.add('sunken-menu-item');
					socialA.href = social.submit && social.submit(url, user, description, files, stars, forks, revisions);
					socialA.title = String.format('[{0}] {1}', key, socialA.href);
					socialA.style.display = 'inline-block';
					socialA.target = '_blank';
					socialImg.src = social.icon;
					socialImg.alt = key;
				}
			}
		}
	}

	// init;
	addMenuItem();

	// on pjax;
	unsafeWindow.$(document).on('pjax:success', addMenuItem);

})();
