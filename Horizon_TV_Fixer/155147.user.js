// ==UserScript==
// @name        Horizon TV Fixer
// @namespace   https://github.com/jerone/UserScripts
// @description Improves the Horizon TV Gids by extending the functionality and the layout of the site.
// @author      jerone
// @copyright   2014+, jerone (http://jeroenvanwarmerdam.nl)
// @license     GNU GPLv3
// @homepage    https://github.com/jerone/UserScripts/tree/master/Horizon_TV_Fixer
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Horizon_TV_Fixer
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Horizon_TV_Fixer/155147.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Horizon_TV_Fixer/155147.user.js
// @supportURL  https://github.com/jerone/UserScripts/issues
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @version     29
// @grant       none
// @include     *horizon.tv*
// ==/UserScript==

(function HorizonTVFixer() {

	// ignore iframes;
	if (!unsafeWindow.BBVSettingsObject) {
		return;
	}

	console.log("Version: " + unsafeWindow.BBVSettingsObject.version.major + "." + unsafeWindow.BBVSettingsObject.version.minor + "." + unsafeWindow.BBVSettingsObject.version.micro);

	/* Social share & Program/Film info; */
	var url = location.href,
		socials = {
			Google: {
				submit: function(title, subtitle, channel, time) {
					return "https://www.google.nl/search?q=" + encodeURIComponent(title + (subtitle ? ", " + subtitle : ""));
				},
				icon: "https://www.google.nl/favicon.ico"
			},
			IMDb: {
				submit: function(title, subtitle, channel, time) {
					return "http://www.imdb.com/find?q=" + encodeURIComponent((title + (subtitle ? " - " + subtitle : "")).trim());
				},
				icon: "https://secure.imdb.com/images/SFff39adb4d259f3c3fd166853a6714a32/legacy/favicon.ico"
			},
			"Trakt.tv": {
				submit: function(title, subtitle, channel, time) {
					return "http://trakt.tv/search?query=" + encodeURIComponent((title + (subtitle ? " - " + subtitle : "")).trim());
				},
				icon: "https://walter.trakt.us/public/favicon.ico"
			},
			YouTube: {
				submit: function(title, subtitle, channel, time) {
					return "https://youtube.com/results?search_query=" + encodeURIComponent((title + (subtitle ? " - " + subtitle : "")).trim());
				},
				icon: "https://youtube.com/favicon.ico"
			},
			Twitter: {
				submit: function(title, subtitle, channel, time) {
					return "https://twitter.com/intent/tweet?original_referer=" + encodeURIComponent(url) +
						"&source=tweetbutton&url=" + encodeURIComponent(url) +
						"&text=" + encodeURIComponent(title + (subtitle ? " - " + subtitle : "") + " op " + channel + " om " + time + " -");
				},
				icon: "https://twitter.com/favicon.ico"
			},
			"Uitzending Gemist": {
				submit: function(title, subtitle, channel, time) {
					return "http://www.uitzendinggemist.nl/zoek?q=" + encodeURIComponent((title + (subtitle ? " - " + subtitle : "")).trim());
				},
				icon: "https://mijn.npo.nl/favicon.ico"
			},
			KijkWijzer: {
				submit: function(title, subtitle, channel, time) {
					return "http://www.kijkwijzer.nl/index.php?id=3__i&searchfor=" + encodeURIComponent((title + (subtitle ? " - " + subtitle : "")).trim());
				},
				icon: "http://www.kijkwijzer.nl/favicon.ico"
			},
			IPTorrents: {
				submit: function(title, subtitle, channel, time) {
					return "https://iptorrents.com/torrents?q=" + encodeURIComponent(title.trim());
				},
				icon: "https://iptorrents.com/favicon.ico"
			}
		};
	new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].classList.contains("popover") && mutation.addedNodes[0].querySelector(".live-channel-popover")) {
				var popup = mutation.addedNodes[0].querySelector(".live-channel-popover");
				if (popup.classList.contains("socials-done")) return;
				popup.classList.add("socials-done");

				var popoverTop = popup.closest(".popover.top");
				if (popoverTop) popoverTop.style.marginTop = "-43px";

				var title = popup.querySelector("h3").textContent.trim();
				var subtitle = "";
				var channel = popup.querySelector(".time-details").textContent.split(",")[0].trim();
				var time = popup.querySelector(".time-details").textContent.split(",")[1].trim();

				var socialsDiv = document.createElement("div");
				socialsDiv.style.marginTop = "12px";
				popup.appendChild(socialsDiv);
				for (var key in socials) {
					var social = socials[key],
						socialA = document.createElement("a"),
						socialImg = document.createElement("img"),
						submit = social.submit(title, subtitle, channel, time);
					socialsDiv.appendChild(socialA);
					socialA.appendChild(socialImg);
					socialA.href = submit;
					socialA.target = "_blank";
					socialA.style.display = "inline-block";
					socialA.style.margin = "2px 2px 0 2px";
					socialImg.src = social.icon;
					socialImg.style.height = socialImg.style.width = "16px";
					socialImg.title = "[" + key + "] " + submit;
				}
			}
		});
	}).observe(document.body, {
		childList: true
	});


	/* Reload; */
	window.setTimeout(() => {
		window.location.href = window.location.href;
	}, 30 * 60 * 1000);


	/* Load channels; */
	/*window.setTimeout(() => {
		window.scrollTo(0, 600);  // Scroll halve way first;
		window.setTimeout(function(){ window.scrollTo(0, 1200); }, 1000);  // Scroll to channel x;
		window.setTimeout(function(){ window.scrollTo(0, 1800); }, 2000);  // Scroll to channel x;
		window.setTimeout(function(){ window.scrollTo(0, 0); }, 3000);  // Back home;
	}, 1000);*/


	/* Style fixes; */
	addStyle(
		/* Crope header; */
		"\
		.servicenav {										\
			display: none !important;						\
		}													\
		.utility-wrapper {									\
			padding-top: 0 !important;						\
		}													\
		a.logo {											\
			height: 40px !important;						\
		}													\
		.nav-item {											\
			padding: 0 !important;							\
		}													\
		.main-header.pinned {								\
			top: 0 !important;								\
		}													\
		" +

		/* Crope filters; */
		"\
		#filters-placeholder {								\
			padding-bottom: 3px !important;					\
			padding-top: 3px !important;					\
			height: auto !important;						\
			min-height: auto !important;					\
		}													\
		.epg_header {										\
			height: 80px !important;						\
		}													\
		.channel-guide-wrap {								\
			margin-top: 80px !important;					\
		}													\
		" +

		/* Crope channels; */
		/*"\
		.channel_line {										\
			height: 40px !important;						\
		}													\
		.channel {											\
			height: 40px !important;						\
		}													\
		.listing_link {										\
			padding: 12px 6px !important;					\
			position: relative;								\
		}													\
		" +*/

		/* Replay notification; */
		"\
		.listing div.notifications {						\
			margin-top: 0;									\
			position: absolute;								\
			right: 0;										\
			top: 0;											\
			opacity: 0.2;									\
		}													\
		.listing:hover div.notifications {					\
			opacity: 1;										\
		}													\
		" +

		/* Channel number; */
		"\
		.channelNumber {									\
			color: #ccc !important;							\
		}													\
		");

	function addStyle(css) {
		var node = document.createElement("style");
		node.type = "text/css";
		node.appendChild(document.createTextNode(css));
		document.head.appendChild(node);
	}

})();
