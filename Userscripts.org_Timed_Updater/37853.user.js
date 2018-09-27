////////////////////////////////////////////////////////////////////////////
// ==UserScript===
// @name            Userscripts.org Timed Updater
// @author          Jerone UserScript Productions
// @namespace       http://userscripts.org/users/31497
// @homepage        http://userscripts.org/scripts/show/37853
// @description     Update or create script at specific time.
// @description     Userscripts.org Timed Updater v2.0.1 Alpha
// @copyright       2008 - 2012 Jerone
// @license         CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license         GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @version         v2.0.1 Alpha
// @browser         FF17
// @include         *userscripts.org/scripts/new?form=true
// @include         *userscripts.org/scripts/edit_src/*
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
30-11-2008 13:30 [v1 Alpha]:
	[+] initial release;
10-01-2009 19:15 [v1.1 Beta]:
	[*] updated framework;
13-11-2010 23:45 [v1.2 Beta]:
	[/] fixed bug with form submit;
	[*] updated @include page;
	[*] cleaned up code;
30-01-2011 21:00 [v2.0 Alpha]:
	[*] removed US Framework;
	[*] clean up code;
	[/] fixed bug with shift, alt and ctrl key;
28-10-2012 13:00 [v2.0.1 Alpha]:
	[/] fixed working on https://userscripts.org;
////////////////////////////////////////////////////////////////////////////
// Todo:
// - count down every seconds when below 1 minute;
////////////////////////////////////////////////////////////////////////////
// Note:
// - 
/*//////////////////////////////////////////////////////////////////////////



//*** USERSCRIPT ***//
(function (win, doc, und) {

	var addEvent = function(node,type,fn,useCapture){if(node.addEventListener){node.addEventListener(type,fn,useCapture);}else if(node.attachEvent){node["e"+type+fn]=fn;node[type+fn]=function(){node["e"+type+fn](win.event);};node.attachEvent("on"+type,node[type+fn]);}};

	var UTU = {
		init: function(){
			var obj;
			if((obj = doc.getElementById("script_src"))){
			
				var container = doc.createElement("span");
				container.style.display = "block";
			
				var label = doc.createElement("label");
				label.htmlFor = label.for = "inputHours";
				label.innerHTML = (/new/i.test(location.href) ? "Create" : "Save") + " script at <code>(h:m)</code>: ";
				container.appendChild(label);
			
				var inputHours = doc.createElement("input");
				inputHours.id = "inputHours";
				inputHours.value = new Date().getHours() + 1;
				inputHours.size = 2;
				inputHours.maxlength = 2;
				inputHours.title = "Hours";
				inputHours.style.textAlign = "center";
				container.appendChild(inputHours);
				
				container.appendChild(doc.createTextNode(" : "));
				
				var inputMinutes = doc.createElement("input");
				inputMinutes.id = "inputMinutes";
				inputMinutes.value = "00";
				inputMinutes.size = 2;
				inputMinutes.maxlength = 2;
				inputMinutes.title = "Minutes";
				inputMinutes.style.textAlign = "center";
				container.appendChild(inputMinutes);

				var btn = doc.createElement("input");
				btn.type = "button";
				btn.value = "Activate timer";
				btn.title = "Click here to activate the timer to submit this script at a specific time!";
				btn.style.marginRight = "10px";
				container.appendChild(btn);
			
				var label2 = doc.createElement("label");
				label2.htmlFor = label2.for = "inputHours";
				label2.innerHTML = "No timer set yet...";
				container.appendChild(label2);
			
				var node = obj.nextSibling;
				while(node.nodeType==3 || !/\S/.test(node.nodeValue)){
					node = node.nextSibling;
				}
				if(/new/i.test(location.href)){
					node.parentNode.insertBefore(container, node.nextSibling);
				} else {
					node.insertBefore(container, node.firstChild);
				}

				var interval, timeout;
				addEvent(inputHours, "keyup", function(e){
					if(e.keyCode==9 || e.keyCode==16 || e.keyCode==17 || e.keyCode==18) return;  // tab, shift, ctrl, alt;
					if(this.value.length>=2){
						inputMinutes.select();
					}
					btn.disabled = false;
					btn.value = "Activate timer";
					win.clearInterval(interval);
					win.clearTimeout(timeout);
					clock();
				});
				addEvent(inputMinutes, "keyup", function(e){
					if(e.keyCode==9 || e.keyCode==16 || e.keyCode==17 || e.keyCode==18) return;  // tab, shift, ctrl, alt;
					if(this.value.length>=2){
						btn.focus();
					}
					btn.disabled = false;
					btn.value = "Activate timer";
					win.clearInterval(interval);
					win.clearTimeout(timeout);
					clock();
				});
				addEvent(btn, "click", function(){
					if(!this.disabled){
						this.disabled = true;
						this.value = "Timer active";
						this.focus();
						timeout = win.setTimeout(function(){
							var form = doc.evaluate("//form[contains(@action, 'create') or contains(@action, 'edit_src')]", doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
							form && form.submit && form.submit();
							win.clearInterval(interval);
							win.clearTimeout(timeout);
						}, clock());
						interval = win.setInterval(function(){
							clock();
						}, 30 * 1000);  // every half a minute;
					}
				});

				function clock(){
					var h = Number(inputHours.value) || 0,
						m = Number(inputMinutes.value) || 0,
						timer = (new Date().setHours(h, m, 0, 0) - new Date().getTime());
					if(timer<0){  // -
						timer += 24 * 60 * 60 * 1000;  // +24 hour;
					}
					label2.innerHTML = "&nbsp;&plusmn;&nbsp;" + humanize(timer) + " remaining.&nbsp;";
					return timer;
				}
				
				function humanize(n, shorten){
					shorten = shorten || false;
					var txt = false,
						unites = [
							{name: "millisecond",	plural: "milliseconds",	min: 0, max: 1000},
							{name: "second",		plural: "seconds",		min: 1000, max: 60*1000},
							{name: "minute",		plural: "minutes",		min: 60*1000, max: 60*60*1000},
							{name: "hour",			plural: "hours",		min: 60*60*1000, max: 24*60*60*1000},
							{name: "day",			plural: "days",			min: 24*60*60*1000, max: 7*24*60*60*1000},
							{name: "week",			plural: "weeks",		min: 7*24*60*60*1000, max: 365*24*60*60*1000},
							{name: "year",			plural: "years",		min: 365*24*60*60*1000, max: Infinity}],
						i = 0, unit;
					for(; unit = unites[i]; i++){
						if(unit.min<=n && n<unit.max){
							var val = Math.floor(n / (unit.min || 1)),
								one = val==1;
							txt = (!one && !shorten ? val + " " : "") + (!one ? unit.plural : unit.name);
						}
					}
					return txt;
				}
			}
		}
	};

	UTU.init();

})(this, document);



//*** STATISTICS ***//
// Chars (exclude spaces): 6.048
// Chars (include spaces): 7.376
// Chars (Chinese): 0
// Words: 768
// Lines: 208
