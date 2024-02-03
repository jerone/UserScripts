// ==UserScript==
// @name         Userscripts.org Source Numbering
// @author       Jerone UserScript Productions
// @namespace    http://userscripts.org/users/31497
// @homepage     http://userscripts.org/scripts/show/38912
// @homepageURL  http://userscripts.org/scripts/show/38912
// @description  Add line numbering to source code.
// @copyright    2008 - 2013 Jerone
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @version      v3
// @include      *userscripts.org/scripts/review/*
// ==/UserScript==

/* cSpell:disable */
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
/*/ /////////////////////////////////////////////////////////////////////////
/* cSpell:enable */

// cSpell:ignore andale, lucida, cellspacing

//*** USER SETTINGS ***//
var maxLines = 10000; // [Integer] maximum number of lines (prevent browser from hanging and possibly crashing);

//*** USERSCRIPT ***//
(function (win, doc, und) {
	try {
		var getStyle = function (node, attr) {
			if (doc.defaultView && doc.defaultView.getComputedStyle) {
				return doc.defaultView
					.getComputedStyle(node, null)
					.getPropertyValue(attr);
			} else if (node.currentStyle) {
				return node.currentStyle[attr];
			}
			return node.style[attr];
		};

		var USN = {
			Init: function () {
				var pre;
				if ((pre = doc.getElementById("source"))) {
					var preHeight = parseFloat(getStyle(pre, "height")),
						lineHeight =
							parseFloat(getStyle(pre, "line-height")) || 16.1; // px;

					// All the CSS;
					var css =
						"																		\
						.numb {																		\
							background-image: linear-gradient(0deg, #eee " +
						lineHeight +
						"px, transparent 0px) !important;\
							background-size: 100% " +
						lineHeight * 2 +
						"px !important;			\
							background-position: 0 4px !important;								\
							border:			1px solid #DDDDDD;										\
							float:			left;													\
							margin:			0;														\
							padding:		5px 0;													\
							position:		relative;												\
							width:			60px;													\
							z-index:		10;														\
						}																			\
						.numbNr {																	\
							font-family:	monospace !important;									\
							font-size:		1.1em !important;										\
						}																			\
						.numbNr td {																\
							border:			0px none !important;									\
							padding:		0px !important;											\
							text-align:		center !important;										\
						}																			\
						.numbNr a,																	\
						.numbNr a:hover,															\
						.numbNr a:active {															\
							color:			#333333;												\
							text-decoration:none;													\
						}																			\
						.numbNr tr:hover a {														\
							font-size:		2em;													\
							line-height:	0.75em;													\
						}																			\
						.numbNr a.decade {															\
							font-size:		2em;													\
							line-height:	0.75em;													\
						}																			\
						.notice {																	\
							margin-bottom:	16px !important;										\
						}																			\
						.highlight {																\
							background-color:yellow !important;												\
							font:			1em/1.5 'andale mono','lucida console',monospace;		\
							font-size:		1.1em;													\
							height:			1.1em;													\
							left:			0;														\
							opacity:		0.5;													\
							position:		absolute;												\
							width:			100%;													\
							z-index:		9;														\
						}																			\
						#source {																	\
							background-image: linear-gradient(0deg, #eee " +
						lineHeight +
						"px, transparent 0px) !important;\
							background-size: 100% " +
						lineHeight * 2 +
						"px !important;			\
							background-position: 0 4px !important;								\
							margin-top:		0px !important;											\
							margin-left:	60px !important;										\
							position:		relative !important;									\
							z-index:		10;														\
						}																			\
						/* Fix for buttons from 'uso - Count Issues' (http://userscripts.org/users/37004) */ \
						.toolbar_menu {																\
							position: absolute;														\
							top: 2px;																\
							right: -4px;															\
						}																			\
					";
					var styler = doc.createElement("style");
					styler.setAttribute("type", "text/css");
					styler.appendChild(doc.createTextNode(css));
					doc.getElementsByTagName("head")[0].appendChild(styler);

					var wrapper = doc.createElement("div");
					wrapper.appendChild(pre.cloneNode(true));
					pre.parentNode.replaceChild(wrapper, pre);
					pre = wrapper.firstChild;

					var div = doc.createElement("div");
					div.className = "numb";
					div.style.height = preHeight + "px";
					pre.parentNode.insertBefore(div, pre);

					var table = doc.createElement("table");
					table.width = "100%";
					table.border = 0;
					table.cellspacing = 0;
					table.cellpadding = 0;
					table.className = "numbNr";
					div.appendChild(table);

					var lines = (maxLines || 5000) + 1,
						i = 1;
					if (preHeight < (lines + 10) * lineHeight) {
						lines = pre.innerHTML.split(/\n/).length + 1;
					}
					for (; i < lines; i++) {
						var tr = doc.createElement("tr"),
							td = doc.createElement("td"),
							a = doc.createElement("a");
						a.setAttribute("id", "line" + i);
						a.setAttribute("href", "#line" + i);
						a.setAttribute("title", "Line " + i);
						a.setAttribute("class", i % 10 ? "" : "decade");
						a.addEventListener(
							"click",
							(function (line) {
								return function () {
									if (!USN.hashEvent.added) {
										win.setTimeout(function () {
											USN.Highlight(line);
										}, 13);
									}
								};
							})(i),
							false,
						);
						a.appendChild(doc.createTextNode(i));
						td.appendChild(a);
						tr.appendChild(td);
						table.appendChild(tr);
					}

					// Add hashchange event;
					USN.hashEvent.Activate();

					// Create shortcut to go to line;
					USN.shortcut();
				}
			},
			hashEvent: (function () {
				var _fn = function () {
					var hash =
							win.location.hash.match(
								/line-?(\d*)(-(\*|\d*))?/,
							) || [],
						begin = parseInt(hash[1], 10),
						end =
							(hash[3] === "*" &&
								doc
									.getElementById("source")
									.innerHTML.split(/\n/).length) ||
							parseInt(hash[3], 10) ||
							begin;
					if (!isNaN(begin)) {
						USN.hashEvent.Fix(begin, end);
					}
				};
				return {
					Activate: function () {
						USN.hashEvent.added = true;
						USN.hashEvent.Add();
						// Do one check once the page has been loaded;
						_fn();
					},
					added: false,
					Add: function () {
						win.addEventListener("hashchange", _fn, false);
					},
					Remove: function () {
						win.removeEventListener("hashchange", _fn, false);
					},
					Fix: function (begin, end) {
						if (!isNaN(begin)) {
							begin = parseInt(begin, 10) || 1;
							end = parseInt(end, 10) || begin;

							// Get the real begin and end number;
							var lineNrTemp = begin;
							begin = Math.min(begin, end);
							end = Math.max(lineNrTemp, end);

							// Setting the correct hash, so that the browser scrolls to that point;
							var oldHash = win.location.hash,
								newHash = "#line" + begin;

							// Temporary remove hashchange event, when it has been activated;
							if (USN.hashEvent.added) {
								USN.hashEvent.Remove();
							}
							// Workaround for hashchange event, where it still detects hash changes;
							win.setTimeout(function () {
								// Set the new hash (stripped to one line number) to activate the hash position;
								win.location.hash = newHash;
								// Re-set the previous hash back;
								win.location.hash = oldHash;
								// Workaround for hashchange event, where it detects old hash changes;
								win.setTimeout(function () {
									// Re-add hashchange event, when it has been activated;
									if (USN.hashEvent.added) {
										USN.hashEvent.Add();
									}
								}, 13);
							}, 13);

							// Highlight the line(s);
							USN.Highlight(begin, end);
						}
					},
				};
			})(),
			Highlight: function (begin, end) {
				var pre = doc.getElementById("source");
				if (pre && !isNaN(begin)) {
					begin = parseInt(begin, 10);
					end = parseInt(end, 10) || begin;
					var range = end - begin + 1;
					// This element with this id should exist;
					var line = doc.getElementById("line" + begin);
					if (line) {
						line = line.parentNode;
						var height =
								parseFloat(getStyle(pre, "line-height")) ||
								16.1,
							top = line.offsetTop;
						while (
							line.offsetParent &&
							line.offsetParent.className !== "container"
						) {
							line = line.offsetParent;
							top += line.offsetTop;
						}
						// If element with class highlight does not exist, create one.
						var highlight =
							doc.getElementsByClassName("highlight")[0];
						if (!highlight) {
							highlight = doc.createElement("div");
							highlight.className = "highlight";
							highlight.style.width = pre.offsetWidth + "px";
							highlight.style.paddingLeft = pre.offsetLeft + "px";
							pre.parentNode.insertBefore(highlight, pre);
						}
						// Place it right below the correct line(s);
						highlight.style.top = top + "px";
						highlight.style.height = height * range + "px";
					}
				}
			},
			shortcut: function () {
				win.addEventListener(
					"keydown",
					function (e) {
						if (e.keyCode === 71 && e.ctrlKey) {
							// Prevent browser 's default behavior on the shortcut;
							e.stopPropagation();
							e.preventDefault();

							// Ask which line(s);
							var line = win.prompt(
								"Which line numbers you want to go to?",
							);
							if (line) {
								// Set the location hash, but we still need the USN.hashEvent.Fix to correct begin+end line numbers;
								win.location.hash = "#line" + line;

								// If the hash event hasn't been activated, highlight the line(s) ourselves;
								if (!USN.hashEvent.added) {
									var split = line.split("-"),
										begin = split[0],
										end =
											(split[1] === "*" &&
												doc
													.getElementById("source")
													.innerHTML.split(/\n/)
													.length) ||
											split[1];
									USN.hashEvent.Fix(begin, end);
								}
							}

							win.focus();
							return false;
						}
					},
					true,
				);
			},
		};

		USN.Init(); // execute;
	} catch (e) {
		win.console && win.console.log(e);
	}
})(unsafeWindow || this, document);

//*** STATISTICS ***//
// Chars (exclude spaces): 9.083
// Chars (include spaces): 12.345
// Chars (Chinese): 0
// Words: 1.328
// Lines: 362
