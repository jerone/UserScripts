// ==UserScript==
// @name        Twitter profile replies hider
// @namespace   https://github.com/jerone/UserScripts
// @description Hide replies on Twitter profiles
// @author      jerone
// @homepage    https://github.com/jerone/UserScripts/tree/master/Hide_replies_on_Twitter_user_account
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Hide_replies_on_Twitter_user_account
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Hide_replies_on_Twitter_user_account/163703.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Hide_replies_on_Twitter_user_account/163703.user.js
// @include     *://twitter.com/*
// @exclude     *://twitter.com/
// @exclude     *://twitter.com
// @version     5
// @grant       none
// ==/UserScript==

(function() {

	var settingsKey = "userscript_hide_replies",
		selector = ".js-stream-tweet[data-is-reply-to]",
		textOn = "Show Replies",
		textOff = "Hide Replies";

	function addMenuItem() {

		// ignore own account;
		//if(document.body.classList.contains("logged-in") && location.href === document.querySelector(".profile a").href) return;

		// tweets timeline;
		var timeline = document.getElementById("stream-items-id") || document.getElementsByClassName("GridTimeline")[0];
		if (!timeline) return;

		// user menu;
		var menuDivider = document.getElementsByClassName("dropdown-divider is-following")[0];
		if (!menuDivider) return;

		// setting;
		var settingSaved = !!~~localStorage.getItem(settingsKey, +true);

		// work-around to get new tweets;
		var loadTweets = function() {
			var y = 0;
			function scroll() {
				y++;
				window.scrollTo(document.documentElement.scrollLeft, document.documentElement.scrollTop + 1);
				if (y < 10) {
					window.setTimeout(scroll, 13);
				} else {
					window.scrollTo(document.documentElement.scrollLeft, document.documentElement.scrollTop - y);
				}
			}
			window.setTimeout(scroll, 13);
		};

		// toggle visibility;
		var toggle = function(hide, init) {
			window.setTimeout(function() {
				Array.forEach(document.querySelectorAll(selector), function(tweet) {
					tweet.style.display = (!hide ? "block" : "none");
				});

				if (hide && init) {
					loadTweets();
				}
			});
		};

		// menu item;
		var liShow = document.createElement("li");
		liShow.appendChild(document.createTextNode(textOn));
		liShow.classList.add("dropdown-link");
		liShow.style.display = (settingSaved ? "block" : "none");
		menuDivider.parentNode.insertBefore(liShow, menuDivider.nextSibling);

		var liHide = document.createElement("li");
		liHide.appendChild(document.createTextNode(textOff));
		liHide.classList.add("dropdown-link");
		liHide.style.display = (!settingSaved ? "block" : "none");
		menuDivider.parentNode.insertBefore(liHide, menuDivider.nextSibling);

		liShow.addEventListener("click", function(e) {
			e.preventDefault();
			localStorage.setItem(settingsKey, +false);
			toggle(false);
			liShow.style.display = "none";
			liHide.style.display = "block";
			return false;
		});

		liHide.addEventListener("click", function(e) {
			e.preventDefault();
			localStorage.setItem(settingsKey, +true);
			toggle(true);
			liShow.style.display = "block";
			liHide.style.display = "none";
			return false;
		});

		// new tweets are loaded, handle accourdanly;
		new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				toggle(!!~~localStorage.getItem(settingsKey, +true));
			});
		}).observe(timeline, { childList: true });

		// load previous state;
		toggle(settingSaved, true);
	}

	window.setTimeout(function() {
		addMenuItem();

		unsafeWindow.$(document).on("uiPageChanged", function() {
			addMenuItem();
		});
	}, 1);

	/* useful for the user popup;
	function MutationObserverStyle(elem, property, fn) {
		var that = this;
		that.propertyChanged = false;
		new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (that.propertyChanged !== (mutation.target.style[property] != "none")) {
					that.propertyChanged = !that.propertyChanged;
					fn();
				}
			});
		}).observe(elem, { attributes: true, attributeFilter: ["style"] });
	}

	MutationObserverStyle(document.getElementById("profile_popup"), "display", function() {
		console.log("MutationObserverStyle propertyChanged");
	});
	*/

	/* alternative page load;
	var window_History_prototype_pushState = window.History.prototype.pushState;
	window.History.prototype.pushState = function() {
		window_History_prototype_pushState.apply(window.history, arguments);
		window.setTimeout(function() {
			//init();
			document.title = "3" + document.title;
		});
	};
	*/

})();