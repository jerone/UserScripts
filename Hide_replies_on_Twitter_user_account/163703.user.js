// ==UserScript==
// @name        Hide replies on Twitter user account
// @namespace   http://userscripts.org/scripts/show/163703
// @description Hide replies on Twitter user account
// @include     *//twitter.com/*
// @exclude     *//twitter.com/
// @exclude     *//twitter.com
// @version     4
// @grant       none
// ==/UserScript==

(function(){

	var settingsKey = "userscript_hide_replies",
		selector = ".tweet[data-is-reply-to]",
		textOn = "Show Replies",
		textOff = "Hide Replies";

	// ignore own account;
	//if(document.body.classList.contains("logged-in") && location.href === document.querySelector(".profile a").href) return;
	
	// ignore non tweets list;
	if(!document.getElementById("stream-items-id")) return;
	
	// user menu;
	var menuDivider = document.getElementsByClassName("dropdown-divider is-following")[0];
	if(!menuDivider) return;

	// setting;
	var settingSaved = !!~~localStorage.getItem(settingsKey, +true);
	
	// work-around to get new tweets;
	var loadTweets = function(){
		var y = 0;
		function scroll(){
			y++;
			window.scrollTo(document.documentElement.scrollLeft, document.documentElement.scrollTop + 1);
			if(y < 10){
				window.setTimeout(scroll, 13);
			} else {
				window.scrollTo(document.documentElement.scrollLeft, document.documentElement.scrollTop - y);
			}
		}
		window.setTimeout(scroll, 13);
	};
	
	// toggle visibility;
	var toggle = function(hide, init){
		window.setTimeout(function(){
			var tweets = document.querySelectorAll(selector);
			Array.forEach(tweets, function(tweet){
				tweet.style.display = (!hide ? "block" : "none");
			});

			if(hide && init){
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
	
	liShow.addEventListener("click", function(e){
		e.preventDefault();
		localStorage.setItem(settingsKey, +false);
		toggle(false);
		liShow.style.display = "none";
		liHide.style.display = "block";
		return false;
	});
	
	liHide.addEventListener("click", function(e){
		e.preventDefault();
		localStorage.setItem(settingsKey, +true);
		toggle(true);
		liShow.style.display = "block";
		liHide.style.display = "none";
		return false;
	});

	// event when DOM changes;
	new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			toggle(!!~~localStorage.getItem(settingsKey, +true));
		});    
	}).observe(document.getElementById("stream-items-id"), { childList: true });
	
	// init;
	toggle(settingSaved, true);

})();



// ==UserStats==
// Chars (excl. spaces): 2.632
// Chars (incl. spaces): 2.978
// Words: 263
// Lines: 111
// ==/UserStats==