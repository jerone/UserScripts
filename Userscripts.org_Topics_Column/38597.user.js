// ==UserScript==
// @name         Userscripts.org Topics Column
// @author       Jerone UserScript Productions
// @namespace    http://userscripts.org/users/31497
// @homepage     http://userscripts.org/scripts/show/38597
// @homepageURL  http://userscripts.org/scripts/show/38597
// @description  Add extra column with scripts topics in script management.
// @copyright    2008 - 2012 Jerone
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @version      v2.1.1-Alpha
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
////////////////////////////////////////////////////////////////////////////
// History:
// [+] = added; [-] = removed; [/] = fixed; [*] = updated;
13-12-2008 18:00 [v1 Alpha]:
	[+] initial release;
17-12-2008 17:30 [v1.1 Beta]:
	[*] cleaned up code;
10-01-2009 17:45 [v1.2 Beta]:
	[*] updated site change;
	[*] updated framework;
11-01-2009 20:00 [v2 Beta]:
	[*] because of site change, changed code to topics;
30-03-2011 23:30 [v2.1 Alpha]:
	[-] removed US Framework;
	[*] clean up code;
28-10-2012 13:00 [v2.1.1 Alpha]:
	[/] fixed working on https://userscripts.org;
////////////////////////////////////////////////////////////////////////////
// Todo:
// -
////////////////////////////////////////////////////////////////////////////
// Note:
// -
/*//////////////////////////////////////////////////////////////////////////


//*** USER SETTINGS ***//
var updateTime =	3*60*60*1000;	// [Number] update time (we don't want to flood userscripts.org);



//*** USERSCRIPT ***//
(function(win, doc, und) {
	try {

		var UTC = {
			init: function(){
				var table = doc.getElementById("main").getElementsByClassName("wide forums")[0],
					trs = table.getElementsByTagName("tr"),
					ths = trs[0].getElementsByTagName("th"),
					tds = [],
					postsIndex,
					topics = eval(GM_getValue("UTC.topics", {}));
				Array.forEach(ths, function(th){
					if(/\bPosts\b/g.test(th.innerHTML)){
						postsIndex = th.cellIndex;
					}
				});
				if(trs.length && postsIndex){
					Array.forEach(trs, function(tr){
						var column = tr.cells[postsIndex];
						if(!/scripts\-/.test(tr.id)){  // Header;
							var th = doc.createElement("th");
							th.className = "la";
							th.width = "1%";
							column.parentNode.insertBefore(th, column);

							var a = doc.createElement("a");
							a.href = "/home/scripts?sort=topics";
							a.innerHTML = "Topics";
							th.appendChild(a);
						} else {  // Script row;
							var td = doc.createElement("td");
							td.className = "inv lp";
							td.innerHTML = "...";
							column.parentNode.insertBefore(td, column);

							tds.push(td);

							var nr = tr.id.match(/\d+/)[0],
								now = new Date().getTime();
							if(typeof(topics[nr])==="number" && now - parseInt(GM_getValue("UTC.lastCheck", 0), 10) < updateTime){
								td.innerHTML = topics[nr] || 0;
							} else {
								GM_xmlhttpRequest({
									method:	"GET",
									url:	"http://userscripts.org/scripts/show/" + nr,
									onload:	(function(td, nr){
										return function countTopics(x){
											var t = 0,
												n = x.responseText.match(/\"\>(\d+)\s+topics?,\s+\d+\s+posts?/);
											if(n && n.length && n[1] && !isNaN(n[1])){
												t = parseInt(n[1], 10);
											}
											td.innerHTML = t;
											topics[nr] = t;
											GM_setValue("UTC.topics", topics.toSource());
											GM_setValue("UTC.lastCheck", new Date().getTime().toString());
										};
									})(td, nr)
								});
							}
						}
					});

					if(/scripts\?sort=topics/i.test(win.location.href)){
						tds.sort(function(a, b){
							return parseInt(a.innerHTML, 10) - parseInt(b.innerHTML, 10);
						});
						var i = tds.length - 1,
							row;
						for(; i>=0; i--){
							row = tds[i].parentNode.parentNode.lastChild;
							row.parentNode.insertBefore(tds[i].parentNode, row.nextSibling);
						}
					}
				}
			}
		}

		UTC.init();  // execute;

	} catch(e){ win.console && win.console.log(e); }
})(unsafeWindow || this, document);



//*** STATISTICS ***//
// Chars (exclude spaces): 4.132
// Chars (include spaces): 5.163
// Chars (Chinese): 0
// Words: 537
// Lines: 157
