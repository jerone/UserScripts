// ==UserScript==
// @name        Horizon TV Fixer
// @namespace   https://userscripts.org/scripts/show/155147
// @description Horizon TV Fixer
// @include     *horizon.tv*
// @version     16
// @grant		GM_addStyle
// ==/UserScript==

(function HorizonTVFixer(){

    console.log("Version: " + unsafeWindow.BBVSettingsObject.version.major + "." + unsafeWindow.BBVSettingsObject.version.minor + "." + unsafeWindow.BBVSettingsObject.version.micro);

	/* Scroll into view; */
	window.setTimeout(function(){
		var head = document.querySelector(".channel-guide-head");
		head && head.scrollIntoView();
	}, 1000);
	
	
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
					return "http://www.youtube.com/results?search_query=" + encodeURIComponent((title + (subtitle ? " - " + subtitle : "")).trim());
				},
				icon: "http://www.youtube.com/favicon.ico"
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
					return "http://iptorrents.com/torrents?q=" + encodeURIComponent(title.trim());
				},
				icon: "http://iptorrents.com/favicon.ico"
			}
		};
    var _orion_modules_EPG_ListingsView_prototype_showDetails = unsafeWindow.orion.modules.EPG.ListingsView.prototype.showDetails;  // https://www.horizon.tv/etc/designs/orion/upc/js/orion/modules/EPG/ListingsView.js?v=34
    unsafeWindow.orion.modules.EPG.ListingsView.prototype.showDetails = function( imi ){
        _orion_modules_EPG_ListingsView_prototype_showDetails.apply(this, arguments);  // execute original code;

        var $listing = unsafeWindow.$('.listing[data-imi="' + imi + '"]');
        var $channel = $listing.closest('.channel-listing'); 
        var station = $channel.get(0);
        var wrap = station.nextSibling;
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
	ForEachListing("tooltip", function(listing){
		listing.title = listing.querySelector(".title").textContent;
	});
	
	
	/* Live/HD green square explanation is removed by CSS fixes below, so we add it back; */
	PageLoad(function(){
		var lives = document.querySelectorAll(".live-hd");
		Array.forEach(lives, function(live){
			live.title = "Kijk LIVE";
		});
	});
	
	
	/* Favicon; */
	var favicon = document.createElement("link");
	favicon.setAttribute("rel", "icon");
	favicon.setAttribute("type", "image/png");
	favicon.setAttribute("href", "//www.horizon.tv/etc/designs/orion/upc/nl/favicon.ico");
	document.querySelector("head").appendChild(favicon);
	
	
	/* Style fixes; */
	GM_addStyle(
/* removed white header; */								"\
.servicenav.service {									\
	display: none;										\
}														"+

/* cropped header; */									"\
.header-options {										\
	margin-top: -60px !important;						\
}														\
.utility-bar .branding,									\
.utility-bar .utility-wrapper {							\
	height: auto;										\
}														\
.utility-bar {											\
	height: 35px;										\
}														\
.branding h1 {											\
	position: relative;									\
	top: 150px;											\
	left: -200px;										\
}														\
.utility.UtilityBar {									\
	position: relative;									\
	z-index: 1;											\
}														\
.navigation.NavigationBar {								\
	z-index: 2;											\
}														\
#channel-guide-head {									\
	display: none;										\
}														"+

/* always show channel logo; */							"\
.network a.logo-active {								\
	display: block !important;							\
}														\
.network a.logo-inactive {								\
	display: none !important;							\
}														"+

/* always show channel number; */						"\
.network span.channel-number {							\
	display: block !important;							\
}														"+

/* hide bottom bar; */									"\
.MyOrionBar  {											\
    display: none;										\
}														"+
	"");
	
	function PageLoad(fn){
		if(unsafeWindow.$){
			//unsafeWindow.$(function(){console.log("events: ", unsafeWindow.$(".channel-guide").data("events") );});
			unsafeWindow.$(".channel-guide").on("loaded", fn);  // only on-page jQuery can catch this event;
		}
	}
	
	function ForEachListing(name, fn){
		PageLoad(function(){
			var listings = document.querySelectorAll(".listing:not(.done-"+name+")");  // get all listings that don't have been processed yet;
			Array.forEach(listings, function(listing){
				listing.classList.add("done-"+name);  // mark element as done;
				fn(listing);
			});
		});
	}

    //unsafeWindow.orion.services.LinearDataService.getActiveListing(unsafeWindow.$(this).data('imi')).done(function(){console.log("test");});

})();



// ==UserStats==
// Chars (excl. spaces): 5.896
// Chars (incl. spaces): 7.506
// Words: 681
// Lines: 213
// ==/UserStats==