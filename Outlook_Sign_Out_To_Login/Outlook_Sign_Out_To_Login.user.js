// ==UserScript==
// @name        Outlook Sign Out To Login
// @namespace   https://github.com/jerone/UserScripts
// @description Redirect back to login page when signing out from Outlook
// @author      jerone
// @copyright   2014+, jerone (https://github.com/jerone)
// @license     CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license     GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @homepage    https://github.com/jerone/UserScripts/tree/master/Outlook_Sign_Out_To_Login
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Outlook_Sign_Out_To_Login
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Outlook_Sign_Out_To_Login/Outlook_Sign_Out_To_Login.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Outlook_Sign_Out_To_Login/Outlook_Sign_Out_To_Login.user.js
// @supportURL  https://github.com/jerone/UserScripts/issues
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @include     *://*.mail.live.com/*
// @version     1
// @grant       none
// ==/UserScript==

(function() {
	document.getElementById("c_signout") && (document.getElementById("c_signout").href = "https://login.live.com/logout.srf?id=64855");
})();
