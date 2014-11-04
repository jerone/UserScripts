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
// @version     22
// @grant       none
// @include     *horizon.tv*
// ==/UserScript==

(function HorizonTVFixer(){

	if(!unsafeWindow.BBVSettingsObject){ return; }  // ignore iframes;

	console.log("Version: " + unsafeWindow.BBVSettingsObject.version.major + "." + unsafeWindow.BBVSettingsObject.version.minor + "." + unsafeWindow.BBVSettingsObject.version.micro);

	/* Social share & Program/Film info; */
	var url = location.href,
		socials = {
			Google: {
				submit: function(title, subtitle, channel, time){
					return "https://www.google.nl/search?q=" + encodeURIComponent(title + (subtitle ? ", " + subtitle : ""));
				},
				icon: "https://www.google.nl/favicon.ico"
			},
			IMDb: {
				submit: function(title, subtitle, channel, time){
					return "http://www.imdb.com/find?q=" + encodeURIComponent((title + (subtitle ? " - " + subtitle : "")).trim());
				},
				icon: "http://www.imdb.com/favicon.ico"
			},
			YouTube: {
				submit: function(title, subtitle, channel, time){
					return "https://youtube.com/results?search_query=" + encodeURIComponent((title + (subtitle ? " - " + subtitle : "")).trim());
				},
				icon: "https://youtube.com/favicon.ico"
			},
			Twitter: {
				submit: function(title, subtitle, channel, time){
					return "https://twitter.com/intent/tweet?original_referer=" + encodeURIComponent(url) +
								"&source=tweetbutton&url=" + encodeURIComponent(url) +
								"&text=" + encodeURIComponent(title + (subtitle ? " - " + subtitle : "") + " op " + channel + " om " + time + " -");
				},
				icon: "https://twitter.com/favicon.ico"
			},
			"Uitzending Gemist": {
				submit: function(title, subtitle, channel, time){
					return "http://www.uitzendinggemist.nl/zoek?q=" + encodeURIComponent((title + (subtitle ? " - " + subtitle : "")).trim());
				},
				icon: "http://www.uitzendinggemist.nl/favicon.gif"
			},
			KijkWijzer: {
				submit: function(title, subtitle, channel, time){
					return "http://www.kijkwijzer.nl/index.php?id=3__i&searchfor=" + encodeURIComponent((title + (subtitle ? " - " + subtitle : "")).trim());
				},
				icon: "http://www.kijkwijzer.nl/favicon.ico"
			},
			IPTorrents: {
				submit: function(title, subtitle, channel, time){
					return "https://iptorrents.com/torrents?q=" + encodeURIComponent(title.trim());
				},
				icon: "https://iptorrents.com/favicon.ico"
			}
		};
	var _orion_modules_EPG_ListingsView_prototype_showDetails = unsafeWindow.orion.modules.EPG.ListingsView.prototype.showDetails;  // https://www.horizon.tv/etc/designs/orion/upc/js/orion/modules/EPG/ListingsView.js?v=34
	unsafeWindow.orion.modules.EPG.ListingsView.prototype.showDetails = function(imi){
		_orion_modules_EPG_ListingsView_prototype_showDetails.apply(this, arguments);  // execute original code;

		var $listing = unsafeWindow.$('.listing[data-imi="' + imi + '"]'),
			$channel = $listing.closest('.channel-listing'),
			station = $channel.get(0),
			wrap = station.nextSibling;
		if(wrap.classList.contains("done-social")) return;  // ignore clicking multiple times on the same program;
		wrap.classList.add("done-social");
		var details = wrap.querySelector(".details"),
			title = details.querySelector("h3").textContent,
			subtitle = (details.querySelector("h4") || { textContent: "" }).textContent,
			channel = details.querySelector(".channel-details").textContent.split(", ");
		var messageDiv = document.createElement("div");
		messageDiv.classList.add("message");
		messageDiv.appendChild(document.createElement("span"));
		messageDiv.style.bottom = "10px";
		messageDiv.style.top = messageDiv.style.width = "auto";
		var messageP = document.createElement("p");
		messageDiv.appendChild(messageP);
		details.appendChild(messageDiv);
		for(var key in socials){
			var social = socials[key],
				socialA = document.createElement("a"),
				socialImg = document.createElement("img"),
				submit = social.submit(title, subtitle, channel[0], channel[1]);
			messageP.appendChild(socialA);
			socialA.appendChild(socialImg);
			socialA.href = submit;
			socialA.target = "_blank";
			socialA.style.display = "inline-block";
			socialA.style.margin = "2px 2px 0 2px";
			socialImg.src = social.icon;
			socialImg.style.height = socialImg.style.width = "16px";
			socialImg.title = "[" + key + "] " + submit;
		}
	};


	/* Tooltips; */
	ForEachListing("tooltip", (listing) => {
		listing.title = listing.querySelector(".title").textContent;
	});


	/* Style fixes; */
	addStyle(
		/* removed white header; */									"\
		.servicenav.service {										\
			display: none;											\
		}															"+

		/* cropped header; */										"\
		.header-options {											\
			margin-top: 5px !important;								\
		}															\
		.utility-wrapper,											\
		.utility-bar {												\
			height: 35px !important;								\
		}															\
		.branding {													\
			display: none;											\
		}															\
		#modules {													\
			padding-top: 0;											\
		}															\
		.channel-guide.module {										\
			padding-top: 10px;										\
		}															\
		.channel-guide.module div.pinned {							\
			top : 35px;												\
			padding: 10px 0 0 0;									\
		}															\
		.navigationbar.pinned {										\
			display: none;											\
		}															\
		.utilitybar.pinned {										\
			background: none;										\
		}															\
		#channel-guide-head {										\
			display: none;											\
		}															\
		.channel-guide .gids-panel .current-time:before {			\
			top: -42px;												\
		}															"+

		/* lower listings; */										"\
		.channel-listing .listings,									\
		.channel-listing .listings .listing,						\
		.channel-listing .listings .listing.active,					\
		.channel-listing .listings .listing .asset-details,			\
		.channel-listing .listings .listing span.title {			\
			height: auto;											\
		}															\
		.channel-listing .listings .listing .asset-details {		\
			height: 24px;											\
		}															\
		.channel-listing .listings .listing .asset-details.short {	\
			padding: 10px 0 0;										\
		}															\
		.network span.channel-number {								\
			top: 10px;												\
		}															\
		.network a.logo-active img {								\
			max-height: 29px;										\
		}															\
		.network .labels {											\
			left: -10px;											\
		}															"+

		/* smaller font size in listing; */							"\
		.channel-listing .listings .listing .title {				\
			font-size: 12px;										\
		}															"+

		/* always show channel logo; */								"\
		.network a.logo-active {									\
			display: block !important;								\
		}															\
		.network a.logo-inactive {									\
			display: none !important;								\
		}															"+

		/* always show channel number; */							"\
		.network span.channel-number {								\
			display: block !important;								\
		}															"+

		/* hide bottom bar; */										"\
		.MyOrionBar  {												\
			display: none;											\
		}															"+
	"");

	function addStyle(css){
		var heads = document.getElementsByTagName("head");
		if (heads.length > 0) {
			var node = document.createElement("style");
			node.type = "text/css";
			node.appendChild(document.createTextNode(css));
			heads[0].appendChild(node);
		}
	}

	function PageLoad(done){
		if(unsafeWindow.$){
			//unsafeWindow.$(function(){console.log("events: ", unsafeWindow.$(".channel-guide").data("events") );});
			unsafeWindow.$(".channel-guide").on("loaded", done);  // only on-page jQuery can catch this event;
		}
	}

	function ForEachListing(name, done){
		PageLoad(function(){
			var listings = document.querySelectorAll(".listing:not(.done-" + name + ")");  // get all listings that don't have been processed yet;
			Array.forEach(listings, (listing) => {
				listing.classList.add("done-" + name);  // mark element as done;
				done(listing);
			});
		});
	}

	//unsafeWindow.orion.services.LinearDataService.getActiveListing(unsafeWindow.$(this).data('imi')).done(function(){console.log("test");});

})();
