// ==UserScript==
// @name         Userscripts.org Versions Tab
// @author       jerone
// @namespace    http://userscripts.org/users/31497
// @homepage     http://userscripts.org/scripts/show/38594
// @homepageURL  http://userscripts.org/scripts/show/38594
// @description  Add versions tab to scripts menu. -- Userscripts.org Versions Tab 3.4
// @copyright    2008 - 2013 jerone
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @version      3.4
// @include      *userscripts.org/scripts/*
// @include      *userscripts.org/topics/*
// @include      *userscripts.org/reviews/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

/*//////////////////////////////////////////////////////////////////////////
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
/*//////////////////////////////////////////////////////////////////////////

(function() {

	// [Number] minimum update interval (we don't want to flood userscripts.org);
	var updateTime = 24 * 60 * 60 * 1000;

	var sourceTab;
	if(/\/review\//.test(location.href)) {  // detect /review/ page first;
		sourceTab = document.querySelector("#script-nav > li.current");
	} else if(document.getElementById("script-nav")) {
		sourceTab = document.querySelector("#script-nav > li > a[href*='/scripts/review/']").parentNode;
	}

	if(sourceTab) {
		var nr;
		if(/\/topics\//.test(location.href) || /\/reviews\//.test(location.href)) {
			nr = sourceTab.firstChild.href.match(/\d+/)[0];
		} else if(/\/scripts\//.test(location.href)) {
			nr = location.href.match(/https?:\/\/userscripts.org\/scripts\/.*\/(\d*)\b/)[1];
		}
		if(!nr) return;

		var versions = eval(GM_getValue("UVT.versions", {}));

		var li = document.createElement("li");
		li.classList.add("menu");
		sourceTab.parentNode.insertBefore(li, sourceTab.nextSibling);

		var a = document.createElement("a");
		a.setAttribute("href", "/scripts/versions/" + nr);
		a.appendChild(document.createTextNode("Versions "));
		li.appendChild(a);

		var span = document.createElement("span");
		span.innerHTML = versions[nr] && versions[nr][0] || 1;
		a.appendChild(span);

		if(location.href.match(/scripts\/versions\/\d*/)){
			li.className = "current";
			var i = document.querySelectorAll("#content > ul > li").length;
			span.innerHTML = i;
			versions[nr] = [i, new Date().getTime().toString()];
			GM_setValue("UVT.versions", versions.toSource());
		} else if(location.href.match(/scripts\/review\/\d*/)){
			var i = parseInt(document.querySelector("#content > p > a").innerHTML.match(/(\d+)\s+previous versions?/)[1], 10);
			i++;  // counting itself too;
			span.innerHTML = i;
			versions[nr] = [i, new Date().getTime().toString()];
			GM_setValue("UVT.versions", versions.toSource());
		} else {
			if(versions[nr] && new Date().getTime() - Number(versions[nr][1]) < updateTime) {
				span.innerHTML = versions[nr][0] || 1;
			} else {
				var throbber = "data:image/gif;base64,"
							+ 'R0lGODlhAQABAOMKAMTExMnJyc3NzdLS0tfX19vb2+Dg4OXl5enp6e7u7v//////////////////'
							+ '/////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQICgD/ACwAAAAAAQABAAAEAjBFACH5BAgKAP8ALAAA'
							+ 'AAABAAEAAAQCEEUAIfkECAoA/wAsAAAAAAEAAQAABALwRAAh+QQICgD/ACwAAAAAAQABAAAEAtBE'
							+ 'ACH5BAgKAP8ALAAAAAABAAEAAAQCsEQAIfkECAoA/wAsAAAAAAEAAQAABAKQRAAh+QQICgD/ACwA'
							+ 'AAAAAQABAAAEAnBEACH5BAgKAP8ALAAAAAABAAEAAAQCUEQAIfkECAoA/wAsAAAAAAEAAQAABAIw'
							+ 'RAAh+QQICgD/ACwAAAAAAQABAAAEAhBEACH5BAgKAP8ALAAAAAABAAEAAAQCMEQAIfkECAoA/wAs'
							+ 'AAAAAAEAAQAABAJQRAAh+QQICgD/ACwAAAAAAQABAAAEAnBEACH5BAgKAP8ALAAAAAABAAEAAAQC'
							+ 'kEQAIfkECAoA/wAsAAAAAAEAAQAABAKwRAAh+QQICgD/ACwAAAAAAQABAAAEAtBEACH5BAgKAP8A'
							+ 'LAAAAAABAAEAAAQC8EQAIfkEAAoA/wAsAAAAAAEAAQAABAIQRQA7';
				li.style.backgroundImage = "url(" + throbber + ")";
				GM_xmlhttpRequest({
					method:	"GET",
					url:	"//userscripts.org/scripts/review/" + nr,
					onload:	(function(elem, nr) {
						return function count(x) {
							var i = 0,
								n = x.responseText.match(/\"\>(\d+)\s+previous versions?<\/a\>/);
							if(n && n.length > 0 && typeof(n[1])!=="undefined" && !isNaN(n[1])){
								i = parseInt(n[1], 10);
							}
							i++;  // counting itself too;
							elem.innerHTML = i;
							versions[nr] = [i, new Date().getTime().toString()];
							GM_setValue("UVT.versions", versions.toSource());
							elem.parentNode.parentNode.style.backgroundImage = "";  // remove throbber;
						};
					})(span, nr)
				});
			}
		}
	}
})();



// ==UserStats==
// Chars (excl. spaces): 4.403
// Chars (incl. spaces): 5.195
// Words: 462
// Lines: 124
// ==/UserStats==
