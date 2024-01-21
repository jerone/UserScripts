// ==UserScript==
// @name        Userscripts.org Diff Extender
// @author      Jerone UserScript Productions
// @namespace   http://userscripts.org/users/31497
// @homepage    http://userscripts.org/scripts/show/38909
// @homepageURL http://userscripts.org/scripts/show/38909
// @description Add some handy features to the diff. -- Userscripts.org Diff Extender v2.2.1 Alpha
// @copyright   2008 - 2012 Jerone
// @license     CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license     GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @version     v2.2.1-alpha
// @browser     FF17
// @include     *userscripts.org/scripts/diff/*
// @grant       none
// ==/UserScript==

/*//////////////////////////////////////////////////////////////////////////
// ToC:
// - Copyrights
// - History
// - Todo
// - Note
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
19-12-2008 16:00 [v1 Alpha]:
	[+] initial release;
10-01-2009 17:45 [v1.1 Beta]:
	[/] minor bug fix in numbering width;
	[*] updated framework;
12-01-2009 16:30 [v1.1.1 Beta]:
	[/] fixed site change;
31-01-2011 14:30 [v2.0 Alpha]:
	[*] removed US Framework;
	[*] clean up code;
19-03-2011 20:30 [v2.1 Alpha]:
	[/] fixed styles bug;
	[/] fixed to small numbering when lower then 10 lines;
	[/] fixed bug with base64 in http://userscripts.org/scripts/diff/16750/48471
	[/] partially fixed compatibility with other scripts;
24-10-2012 22:30 [v2.2 Alpha]:
	[/] fixed removing cdata, because FF stopped supporting EX4;
28-10-2012 13:00 [v2.2.1 Alpha]:
	[/] fixed working on https://userscripts.org;
////////////////////////////////////////////////////////////////////////////
// Todo:
// - show inline differences; 
////////////////////////////////////////////////////////////////////////////
// Note:
// -
/*//////////////////////////////////////////////////////////////////////////



//*** USERSCRIPT ***//
(function(win, doc, und) {

	var xPath = function(xpath, root){
		var next,
			got = doc.evaluate(xpath, root || doc, null, null, null),
			result = [];
		while((next = got.iterateNext())) result.push(next);
		return result;
	};

	var UDE = {
		init: function(){
			var pre;
			if((pre = doc.getElementById("content").getElementsByTagName("pre")[0])){
				pre.style.paddingLeft = "15px";
				pre.style.lineHeight = "17px";
				pre.style.paddingTop = "0";
				
				var scrollWidth = (Math.max(parseInt(pre.scrollWidth), 0) || 1000) + "px";
				
				var css = "																			\
					.diff {																			\
						background-color:	#EEEEEE;												\
						float:				left;													\
						line-height:		17px;													\
						margin:				0;														\
						padding:			0 0 22px 0;											\
						border-color:		#DDDDDD;												\
						border-style:		solid;													\
						border-width:		1px 0 1px 3px;											\
					}																				\
					.diffNr {																		\
						font:				0.9em/1.5 'andale mono','lucida console',monospace;		\
						margin:				0;														\
						padding:			0;														\
						text-align:			center !important;										\
					}																				\
					.diffNr td {																	\
						border:				0 none;													\
						min-width:			14px;													\
						padding:			0px 3px !important;										\
						text-align:			center !important;										\
					}																				\
					.diffMeta {																		\
						background-color:	#CCCCCC;												\
					}																				\
					.diffAdd {																		\
						background-color:	#FF8888;												\
					}																				\
					.diffDel {																		\
						background-color:	#99FF99;												\
					}																				\
					.diffSim {																		\
						float:				left;													\
						margin-right:		5px;													\
						padding:			0px 5px 0px 4px;										\
					}																				\
				";
				var styler = doc.createElement("style");
				styler.setAttribute("type", "text/css");
				styler.appendChild(doc.createTextNode(css));
				doc.getElementsByTagName("head")[0].appendChild(styler);

				var wrapper = document.createElement("div");
				wrapper.appendChild(pre.cloneNode(true));
				pre.parentNode.replaceChild(wrapper, pre);
				pre = wrapper.firstChild;
				
				var div = doc.createElement("div");
				div.className = "diff";
				pre.parentNode.insertBefore(div, pre);

				var table = doc.createElement("table");
				table.width = "100%";
				table.border = 0;
				table.cellspacing = 0;
				table.cellpadding = 0;
				table.className = "diffNr";
				div.appendChild(table);
				
				xPath(".//div[@class='meta']", pre).forEach(function(meta){
					meta.style.marginLeft = "-15px";
					meta.style.width = scrollWidth;
					
					var tr = doc.createElement("tr");
					table.appendChild(tr);
					
					var tdDel = doc.createElement("td");
					tdDel.className = "diffMeta";
					tdDel.width = "50%";
					tdDel.appendChild(doc.createTextNode("-"));
					tr.appendChild(tdDel);
					
					var tdAdd = doc.createElement("td");
					tdAdd.className = "diffMeta";
					tdAdd.width = "50%";
					tdAdd.appendChild(doc.createTextNode("+"));
					tr.appendChild(tdAdd);

					var iOld = meta.textContent.match(/^@@\s\-(\d+),\d+\s\+(\d+),\d+\s@@/)[1];
					var iNew = meta.textContent.match(/^@@\s\-(\d+),\d+\s\+(\d+),\d+\s@@/)[2];
					while(meta.nextSibling && meta.nextSibling.className!="meta"){
						var temp = meta.nextSibling.textContent.split(/\n/);
						temp.splice(-1, 1);
						var tdDel, tdAdd;
						temp.forEach(function(item){
							var tr = doc.createElement("tr");
							table.appendChild(tr);

							tdDel = doc.createElement("td");
							tr.appendChild(tdDel);
							
							tdAdd = doc.createElement("td");
							tr.appendChild(tdAdd);
							
							if(!item.match(/^\+/)){
								tdDel.className = "diffAdd";
								tdDel.appendChild(doc.createTextNode(iOld));
								iOld++;
							}
							if(!item.match(/^\-/)){
								tdAdd.className = "diffDel";
								tdAdd.appendChild(doc.createTextNode(iNew));
								iNew++;
							}
						});
						if(meta.nodeType===3){
							tdDel.style.borderTop = "1px solid #FF8888";
							tdAdd.style.borderTop = "1px solid #99FF99";
						}
						if(meta.nextSibling.nextSibling && meta.nextSibling.nextSibling.nodeType===3){
							tdDel.style.borderBottom = "1px solid #FF8888";
							tdAdd.style.borderBottom = "1px solid #99FF99";
						}
						meta = meta.nextSibling;
					}
				});

				xPath(".//div[@class='del' or @class='add']", pre).forEach(function(del){
					var temp = del.textContent;
					del.style.width = scrollWidth;
					del.style.marginLeft = "-15px";
					del.style.borderColor = (/^\-/.test(temp) ? "#AA3333" : "#33AA33");
					del.style.borderStyle = "solid";
					del.style.borderWidth = (del.previousSibling.nodeType==3 ? "1px" : "0px") + " 1px " + (del.nextSibling.nodeType==3 ? "1px" : "0px") + " 1px";
					while(del.hasChildNodes()) del.removeChild(del.firstChild);
					del.appendChild(doc.createTextNode(temp.replace(/^[\+\-]/, "")));
					var span = doc.createElement("span");
					span.className = (/^\-/.test(temp) ? "diffAdd" : "diffDel") + " diffSim";
					span.innerHTML = temp.match(/^[\+\-]/);
					del.insertBefore(span, del.firstChild);
				});
			}
		}
	};

	UDE.init();  // execute;

})(this, document);



//*** STATISTICS ***//
// Chars (exclude spaces): 6.091
// Chars (include spaces): 8.055
// Chars (Chinese): 0
// Words: 760
// Lines: 233
