// ==UserScript==
// @name         Userscripts.org Versions Column
// @author       Jerone UserScript Productions
// @namespace    http://userscripts.org/users/31497
// @homepage     http://userscripts.org/scripts/show/38595
// @homepageURL  http://userscripts.org/scripts/show/38595
// @description  Add extra column with scripts versions in script management.
// @copyright    2008 - 2012 Jerone
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @version      v1.3.1-Alpha
// @browser      FF17
// @include      *userscripts.org/home/scripts
// @include      *userscripts.org/home/scripts*
// ==/UserScript==

/*//////////////////////////////////////////////////////////////////////////
// ToC:
// - Copyrights
// - History
// - Todo
// - Note
// - User Settings
// - Userscript
// - Statistics
////////////////////////////////////////////////////////////////////////////
// cSpell:disable
THIS  SCRIPT  IS  PROVIDED BY THE AUTHOR `AS IS' AND ANY EXPRESS OR IMPLIED
WARRANTIES,  INCLUDING, BUT  NOT  LIMITED  TO, THE  IMPLIED  WARRANTIES  OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO
EVENT  SHALL  THE  AUTHOR  BE  LIABLE  FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;  LOSS OF USE, DATA, OR PROFITS;
OR BUSINESS INTERRUPTION) HOWEVER  CAUSED  AND  ON  ANY THEORY OF LIABILITY,
WHETHER  IN  CONTRACT, STRICT  LIABILITY, OR  TORT  (INCLUDING NEGLIGENCE OR
OTHERWISE)  ARISING  IN  ANY  WAY  OUT  OF  THE  USE OF THIS SCRIPT, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
// cSpell:enable
////////////////////////////////////////////////////////////////////////////
// History:
// [+] = added; [-] = removed; [/] = fixed; [*] = updated;
13-12-2008 18:00 [v1 Alpha]:
	[+] initial release;
15-12-2008 20:00 [v1.1 Beta]:
	[/] fixed bug with 25+ versions;
	[+] added sorting by versions;
	[*] cleaned up code;
15-12-2008 20:15 [v1.1.1 Beta]:
	[/] fixed small bug in sorting;
10-01-2009 19:30 [v1.2 Beta]:
	[*] updated framework;
31-03-2011 21:45 [v1.3 Alpha]:
	[-] removed US Framework;
	[*] clean up code;
28-10-2012 13:00 [v1.3.1 Alpha]:
	[/] fixed working on https://userscripts.org;
////////////////////////////////////////////////////////////////////////////
// Todo:
// -
////////////////////////////////////////////////////////////////////////////
// Note:
// -
/*/ /////////////////////////////////////////////////////////////////////////

/* eslint security/detect-object-injection: "off" */
/* eslint security/detect-eval-with-expression: "off" */

//*** USER SETTINGS ***//
var updateTime = 3 * 60 * 60 * 1000; // [Integer] update time (we don't want to flood userscripts.org);

//*** USERSCRIPT ***//
(function (win, doc, und) {
	try {
		var UVC = {
			init: function () {
				var table = doc
						.getElementById("main")
						.getElementsByClassName("wide forums")[0],
					trs = table.getElementsByTagName("tr"),
					ths = trs[0].getElementsByTagName("th"),
					tds = [],
					postsIndex,
					versions = eval(GM_getValue("UVC.versions", {}));
				Array.forEach(ths, function (th) {
					if (/\bInstalls\b/g.test(th.innerHTML)) {
						postsIndex = th.cellIndex;
					}
				});
				if (trs.length && postsIndex) {
					Array.forEach(trs, function (tr) {
						var column = tr.cells[postsIndex];
						if (!/scripts\-/.test(tr.id)) {
							// Header;
							var th = doc.createElement("th");
							th.className = "la";
							th.width = "1%";
							column.parentNode.insertBefore(th, column);

							var a = doc.createElement("a");
							a.href = "/home/scripts?sort=versions";
							a.innerHTML = "Versions";
							th.appendChild(a);
						} else {
							// Script row;
							var td = doc.createElement("td");
							td.className = "inv lp";
							td.innerHTML = "...";
							column.parentNode.insertBefore(td, column);

							tds.push(td);

							var nr = tr.id.match(/\d+/)[0],
								now = new Date().getTime();
							if (
								typeof versions[nr] === "number" &&
								now -
									parseInt(
										GM_getValue("UVC.lastCheck", 0),
										10,
									) <
									updateTime
							) {
								td.innerHTML = versions[nr] || 0;
							} else {
								GM_xmlhttpRequest({
									method: "GET",
									url:
										"http://userscripts.org/scripts/review/" +
										nr,
									onload: (function (td, nr) {
										return function count(x) {
											var i = 0,
												n = x.responseText.match(
													/\"\>(\d+)\s+previous versions?<\/a\>/,
												);
											if (
												n &&
												n.length > 0 &&
												typeof n[1] !== "undefined" &&
												!isNaN(n[1])
											) {
												i = parseInt(n[1], 10);
											}
											i++; // counting itself too;
											td.innerHTML = i;
											versions[nr] = i;
											GM_setValue(
												"UVC.versions",
												versions.toSource(),
											);
											GM_setValue(
												"UVC.lastCheck",
												new Date().getTime().toString(),
											);
										};
									})(td, nr),
								});
							}
						}
					});

					if (/scripts\?sort=versions/i.test(win.location.href)) {
						tds.sort(function (a, b) {
							return (
								parseInt(a.innerHTML, 10) -
								parseInt(b.innerHTML, 10)
							);
						});
						var i = tds.length - 1,
							row;
						for (; i >= 0; i--) {
							row = tds[i].parentNode.parentNode.lastChild;
							row.parentNode.insertBefore(
								tds[i].parentNode,
								row.nextSibling,
							);
						}
					}
				}
			},
		};

		UVC.init(); // execute;
	} catch (e) {
		win.console && win.console.log(e);
	}
})(unsafeWindow || this, document);

//*** STATISTICS ***//
// Chars (exclude spaces): 4.225
// Chars (include spaces): 5.276
// Chars (Chinese): 0
// Words: 547
// Lines: 160
