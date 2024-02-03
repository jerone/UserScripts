// ==UserScript==
// @name             Darts Data Enhancer
// @id               Darts_Data_Enhancer@https://github.com/jerone/UserScripts
// @namespace        https://github.com/jerone/UserScripts
// @description      Enhances Darts Data
// @author           jerone
// @copyright        2015+, jerone (https://github.com/jerone)
// @license          CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license          GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @homepage         https://github.com/jerone/UserScripts/tree/master/Darts_Data_Enhancer#readme
// @homepageURL      https://github.com/jerone/UserScripts/tree/master/Darts_Data_Enhancer#readme
// @downloadURL      https://github.com/jerone/UserScripts/raw/master/Darts_Data_Enhancer/Darts_Data_Enhancer.user.js
// @updateURL        https://github.com/jerone/UserScripts/raw/master/Darts_Data_Enhancer/Darts_Data_Enhancer.user.js
// @supportURL       https://github.com/jerone/UserScripts/issues
// @contributionURL  https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @version          1.0.0
// @grant            none
// @run-at           document-end
// @include          http://live.dartsdata.com/MatchesList.aspx
// ==/UserScript==

var playersLeft = document.querySelectorAll(
	"#ctl01 > table:nth-child(9) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > table > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > div > table > tbody > tr > td:nth-child(2)",
);
var playersRight = document.querySelectorAll(
	"#ctl01 > table:nth-child(9) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > table > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > div > table > tbody > tr > td:nth-child(6)",
);
var players = Array.prototype.concat.apply(
	Array.prototype.concat.apply([], playersLeft),
	playersRight,
);
Array.prototype.forEach.call(players, function (player) {
	var name = player.textContent.trim();
	if (~name.indexOf("Winner Of Match")) return;
	var link = document.createElement("a");
	link.setAttribute(
		"href",
		"https://www.google.com/search?q=" + encodeURIComponent(name),
	);
	link.setAttribute("target", "_blank");
	link.appendChild(document.createTextNode(name));
	link.style.color = "#FFF";
	player.innerHTML = "";
	player.appendChild(link);
});
