// ==UserScript==
// @id          Marktplaats_Exchanger@https://github.com/jerone/UserScripts
// @name        Marktplaats Exchanger
// @namespace   https://github.com/jerone/UserScripts
// @description Exchange Marktplaats.nl
// @author      jerone
// @copyright   2015+, jerone (http://jeroenvanwarmerdam.nl)
// @license     CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license     GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @homepage    https://github.com/jerone/UserScripts/tree/master/Marktplaats_Exchanger#readme
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Marktplaats_Exchanger#readme
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Marktplaats_Exchanger/Marktplaats_Exchanger.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Marktplaats_Exchanger/Marktplaats_Exchanger.user.js
// @supportURL  https://github.com/jerone/UserScripts/issues
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @version     1.0.0
// @grant       none
// @run-at      document-end
// @include     https://www.marktplaats.*
// ==/UserScript==

(function Marktplaats_Exchanger() {
	var selectAll = document.getElementById("select-all-container");
	if (!selectAll) {
		return;
	}

	var button = document.createElement("div");
	button.setAttribute("title", "Selecteer alle verkochte advertenties");
	button.style.background = "transparent linear-gradient(to bottom, #FEFEFE 0%, #D9D9D9 100%) repeat scroll 0% 0%";
	button.style.border = "1px solid #A1A1A1";
	button.style.cssFloat = "left";
	button.style.cursor = "default";
	button.style.height = "30px";
	button.style.marginRight = "5px";
	button.style.padding = "0 8px";
	selectAll.parentNode.insertBefore(button, selectAll.nextSibling);

	var selectInput = document.createElement("input");
	selectInput.setAttribute("type", "checkbox");
	selectInput.addEventListener("change", function selectInputChange() {
		var checked = selectInput.checked;
		Array.prototype.forEach.call(document.querySelectorAll(".ad-listing"), function(row) {
			var isRemoved = row.classList.contains("removed");
			var checkbox = row.querySelector("input.kopen-select");
			if (checkbox.checked !== (checked && isRemoved)) {
				checkbox.click();
			}
		});
	});
	button.appendChild(selectInput);

	button.appendChild(document.createTextNode(" Verkocht"));
})();
