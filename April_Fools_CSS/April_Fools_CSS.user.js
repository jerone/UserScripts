// ==UserScript==
// @name           April Fools CSS
// @description    Some CSS april fools
// @author         jerone
// @namespace      https://github.com/jerone/UserScripts/tree/master/April_Fools_CSS
// @copyright      2014+, jerone (http://jeroenvanwarmerdam.nl)
// @license        CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license        GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @supportURL     https://github.com/jerone/UserScripts/issues
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @include        *
// @version        1.0
// ==/UserScript==

if(window.top===window){

	var duration = 2000,	// [Integer, positive, miliseconds] This controls the duration of an april fool item;
		interval = 8000;	// [Integer, positive, miliseconds] This controls the interval of the next april fool;

	var aprilFools = [		// [String] April fools in CSS; Use {duration} for a dynamic duration;
			"img {										\
				-webkit-transform: rotate(180deg);		\
				   -moz-transform: rotate(180deg);		\
				    -ms-transform: rotate(180deg);		\
				     -o-transform: rotate(180deg);		\
				        transform: rotate(180deg);		\
			}",
			"body {										\
				-webkit-transform: rotate(1deg);		\
				   -moz-transform: rotate(1deg);		\
				    -ms-transform: rotate(1deg);		\
				     -o-transform: rotate(1deg);		\
				        transform: rotate(1deg);		\
			}",
			"body {										\
				-webkit-perspective: 300px; 			\
				   -moz-perspective: 300px; 			\
				    -ms-perspective: 300px; 			\
					    perspective: 300px;				\
				-webkit-transform: rotateY(180deg);		\
				   -moz-transform: rotateY(180deg);		\
				    -ms-transform: rotateY(180deg);		\
					    transform: rotateY(180deg);		\
				-webkit-transform-style: preserve-3d;	\
				   -moz-transform-style: preserve-3d;	\
				    -ms-transform-style: preserve-3d;	\
					    transform-style: preserve-3d;	\
			}",
			"img {										\
				-webkit-transform: scale(0.8); 			\
				   -moz-transform: scale(0.8); 			\
				    -ms-transform: scale(0.8); 			\
				     -o-transform: scale(0.8); 			\
					transform: scale(0.8); 				\
			}",
			"img { -webkit-animation: spin {duration}s linear infinite; }	\
			@-webkit-keyframes spin {										\
				  0% { -webkit-transform: rotate(0deg); }					\
				100% { -webkit-transform: rotate(360deg); }					\
			}",
			"body { -webkit-animation: rainbow {duration}s infinite; }		\
			@-webkit-keyframes rainbow {									\
				100% { -webkit-filter: hue-rotate(360deg); }				\
			}",
		],
		aprilFool = 0, aprilFooled = 0;

	interval = Math.abs(interval);
	duration = Math.max(1000, Math.abs(duration));

	window.setInterval(function(){
		do { aprilFool = Math.floor(Math.random() * aprilFools.length);
		} while(aprilFool === aprilFooled);
		document.documentElement.classList.add("aprilfool" + (aprilFooled = aprilFool));
		window.console&&console.log("added aprilfool" + aprilFool);
		window.setTimeout(function(){
			document.documentElement.classList.remove("aprilfool" + aprilFooled);
			window.console&&console.log("removed aprilfool" + aprilFool);
		}, duration);
	}, interval + duration + 10);

	for(var aprilFool in aprilFools){
		GM_addStyle(".aprilfool" + aprilFool + " " + aprilFools[aprilFool].replace("{duration}", duration/1000));
	}
}
