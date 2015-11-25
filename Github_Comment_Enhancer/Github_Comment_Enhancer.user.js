// ==UserScript==
// @id          Github_Comment_Enhancer@https://github.com/jerone/UserScripts
// @name        Github Comment Enhancer
// @namespace   https://github.com/jerone/UserScripts
// @description Enhances Github comments
// @author      jerone
// @copyright   2014+, jerone (http://jeroenvanwarmerdam.nl)
// @license     GNU GPLv3
// @homepage    https://github.com/jerone/UserScripts/tree/master/Github_Comment_Enhancer#readme
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Github_Comment_Enhancer#readme
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Github_Comment_Enhancer/Github_Comment_Enhancer.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Github_Comment_Enhancer/Github_Comment_Enhancer.user.js
// @supportURL  https://github.com/jerone/UserScripts/issues
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @version     2.7.0
// @grant       none
// @run-at      document-end
// @include     https://github.com/*
// @include     https://gist.github.com/*
// ==/UserScript==
/* global unsafeWindow */

(function(unsafeWindow) {

	String.format = function(string) {
		var args = Array.prototype.slice.call(arguments, 1, arguments.length);
		return string.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] !== "undefined" ? args[number] : match;
		});
	};

	// Choose the character that precedes the list;
	var listCharacter = ["*", "-", "+"][0];

	// Choose the characters that makes up a horizontal line;
	var lineCharacter = ["***", "---", "___"][0];

	// Source: https://github.com/gollum/gollum/blob/9c714e768748db4560bc017cacef4afa0c751a63/lib/gollum/public/gollum/javascript/editor/langs/markdown.js
	var MarkDown = (function MarkDown() {
		return {
			"function-bold": {
				search: /^(\s*)([\s\S]*?)(\s*)$/g,
				replace: "$1**$2**$3",
				shortcut: "ctrl+b"
			},
			"function-italic": {
				search: /^(\s*)([\s\S]*?)(\s*)$/g,
				replace: "$1_$2_$3",
				shortcut: "ctrl+i"
			},
			"function-underline": {
				search: /^(\s*)([\s\S]*?)(\s*)$/g,
				replace: "$1<ins>$2</ins>$3",
				shortcut: "ctrl+u"
			},
			"function-strikethrough": {
				search: /^(\s*)([\s\S]*?)(\s*)$/g,
				replace: "$1~~$2~~$3",
				shortcut: "ctrl+s"
			},

			"function-h1": {
				search: /(.+)([\n]?)/g,
				replace: "# $1$2",
				forceNewline: true,
				shortcut: "ctrl+1"
			},
			"function-h2": {
				search: /(.+)([\n]?)/g,
				replace: "## $1$2",
				forceNewline: true,
				shortcut: "ctrl+2"
			},
			"function-h3": {
				search: /(.+)([\n]?)/g,
				replace: "### $1$2",
				forceNewline: true,
				shortcut: "ctrl+3"
			},
			"function-h4": {
				search: /(.+)([\n]?)/g,
				replace: "#### $1$2",
				forceNewline: true,
				shortcut: "ctrl+4"
			},
			"function-h5": {
				search: /(.+)([\n]?)/g,
				replace: "##### $1$2",
				forceNewline: true,
				shortcut: "ctrl+5"
			},
			"function-h6": {
				search: /(.+)([\n]?)/g,
				replace: "###### $1$2",
				forceNewline: true,
				shortcut: "ctrl+6"
			},

			"function-link": {
				exec: function(button, selText, commentForm, next) {
					var selTxt = selText.trim(),
						isUrl = selTxt && /(?:https?:\/\/)|(?:www\.)/.test(selTxt),
						href = window.prompt("Link href:", isUrl ? selTxt : ""),
						text = window.prompt("Link text:", isUrl ? "" : selTxt);
					if (href) {
						next(String.format("[{0}]({1}){2}", text || href, href, (/\s+$/.test(selText) ? " " : "")));
					}
				},
				shortcut: "ctrl+l"
			},
			"function-image": {
				exec: function(button, selText, commentForm, next) {
					var selTxt = selText.trim(),
						isUrl = selTxt && /(?:https?:\/\/)|(?:www\.)/.test(selTxt),
						href = window.prompt("Image href:", isUrl ? selTxt : ""),
						text = window.prompt("Image text:", isUrl ? "" : selTxt);
					if (href) {
						next(String.format("![{0}]({1}){2}", text || href, href, (/\s+$/.test(selText) ? " " : "")));
					}
				},
				shortcut: "ctrl+g"
			},

			"function-ul": {
				search: /(.+)([\n]?)/g,
				replace: String.format("{0} $1$2", listCharacter),
				forceNewline: true,
				shortcut: "alt+ctrl+u"
			},
			"function-ol": {
				exec: function(button, selText, commentForm, next) {
					var repText = "";
					if (!selText) {
						repText = "1. ";
					} else {
						var lines = selText.split("\n"),
							hasContent = /[\w]+/;
						for (var i = 0; i < lines.length; i++) {
							if (hasContent.test(lines[i])) {
								repText += String.format("{0}. {1}\n", i + 1, lines[i]);
							}
						}
					}
					next(repText);
				},
				shortcut: "alt+ctrl+o"
			},
			"function-checklist": {
				search: /(.+)([\n]?)/g,
				replace: String.format("{0} [ ] $1$2", listCharacter),
				forceNewline: true,
				shortcut: "alt+ctrl+t"
			},

			"function-code": {
				exec: function(button, selText, commentForm, next) {
					var rt = selText.indexOf("\n") > -1 ? "$1\n```\n$2\n```$3" : "$1`$2`$3";
					next(selText.replace(/^(\s*)([\s\S]*?)(\s*)$/g, rt));
				},
				shortcut: "ctrl+k"
			},
			"function-code-syntax": {
				exec: function(button, selText, commentForm, next) {
					var rt = "$1\n```" + button.dataset.value + "\n$2\n```$3";
					next(selText.replace(/^(\s*)([\s\S]*?)(\s*)$/g, rt));
				}
			},

			"function-blockquote": {
				search: /(.+)([\n]?)/g,
				replace: "> $1$2",
				forceNewline: true,
				shortcut: "ctrl+q"
			},
			"function-rule": {
				append: String.format("\n{0}\n", lineCharacter),
				forceNewline: true,
				shortcut: "ctrl+r"
			},
			"function-table": {
				append: "\n" +
					"| Head | Head   | Head  |\n" +
					"| :--- | :----: | ----: |\n" +
					"| Cell | Cell   | Cell  |\n" +
					"| Left | Center | Right |\n",
				forceNewline: true,
				shortcut: "alt+shift+t"
			},

			"function-clear": {
				exec: function(button, selText, commentForm, next) {
					commentForm.value = "";
					next("");
				},
				shortcut: "alt+ctrl+x"
			},

			"function-snippets-tab": {
				exec: function(button, selText, commentForm, next) {
					next("\t");
				}
			},
			"function-snippets-useragent": {
				exec: function(button, selText, commentForm, next) {
					next("`" + navigator.userAgent + "`");
				}
			},
			"function-snippets-contributing": {
				exec: function(button, selText, commentForm, next) {
					next("Please, always consider reviewing the [guidelines for contributing](../blob/master/CONTRIBUTING.md) to this repository.");
				}
			},

			"function-emoji": {
				exec: function(button, selText, commentForm, next) {
					next(button.dataset.value);
				}
			}
		};
	})();

	var toolBarLeftHTML =
		'<div id="gollum-editor-function-buttons" style="float: left;">' +

		/* Bold, italic, underline & Strikethrough; */
		'	<div class="button-group btn-group">' +
		'		<a href="#" id="function-bold" class="btn btn-sm minibutton function-button tooltipped tooltipped-ne" aria-label="Bold (ctrl+b)">' +
		'			<b style="font-weight: bolder;">B</b>' +
		'		</a>' +
		'		<a href="#" id="function-italic" class="btn btn-sm minibutton function-button tooltipped tooltipped-ne" aria-label="Italic (ctrl+i)">' +
		'			<em>i</em>' +
		'		</a>' +
		'		<a href="#" id="function-underline" class="btn btn-sm minibutton function-button tooltipped tooltipped-ne" aria-label="Underline (ctrl+u)">' +
		'			<ins>U</ins>' +
		'		</a>' +
		'		<a href="#" id="function-strikethrough" class="btn btn-sm minibutton function-button tooltipped tooltipped-ne" aria-label="Strikethrough (ctrl+s)">' +
		'			<s>S</s>' +
		'		</a>' +
		'	</div>' +

		/* Headers (1 - 6); */
		'	<div class="button-group btn-group">' +
		'		<div class="select-menu js-menu-container js-select-menu tooltipped tooltipped-ne" aria-label="Headers">' +
		'			<a id="function-h1" class="btn btn-sm minibutton select-menu-button icon-only js-menu-target  function-button function-dummy" aria-label="Headers" style="padding-left:7px; padding-right:7px; width:auto; border-bottom-right-radius:3px; border-top-right-radius:3px;">' +
		'				<span class="js-select-button">h#</span>' +
		'			</a>' +
		'			<div class="select-menu-modal-holder js-menu-content js-navigation-container" style="top:26px; z-index:22;">' +
		'				<div class="select-menu-modal" style="width:auto; overflow:visible;">' +
		'					<div class="select-menu-header">' +
		'						<span class="select-menu-title">Choose header</span>' +
		'						<span class="octicon octicon-remove-close js-menu-close"></span>' +
		'					</div>' +
		'					<div class="button-group btn-group" style="min-width:175px;">' +
		'						<a href="#" id="function-h1" class="btn btn-sm minibutton function-button js-navigation-item js-menu-close tooltipped tooltipped-s" aria-label="Header 1 (ctrl+1)">' +
		'							<b class="select-menu-item-text js-select-button-text">h1</b>' +
		'						</a>' +
		'						<a href="#" id="function-h2" class="btn btn-sm minibutton function-button js-navigation-item js-menu-close tooltipped tooltipped-s" aria-label="Header 2 (ctrl+2)">' +
		'							<b class="select-menu-item-text js-select-button-text">h2</b>' +
		'						</a>' +
		'						<a href="#" id="function-h3" class="btn btn-sm minibutton function-button js-navigation-item js-menu-close tooltipped tooltipped-s" aria-label="Header 3 (ctrl+3)">' +
		'							<b class="select-menu-item-text js-select-button-text">h3</b>' +
		'						</a>' +
		'						<a href="#" id="function-h4" class="btn btn-sm minibutton function-button js-navigation-item js-menu-close tooltipped tooltipped-s" aria-label="Header 4 (ctrl+4)">' +
		'							<b class="select-menu-item-text js-select-button-text">h4</b>' +
		'						</a>' +
		'						<a href="#" id="function-h5" class="btn btn-sm minibutton function-button js-navigation-item js-menu-close tooltipped tooltipped-s" aria-label="Header 5 (ctrl+5)">' +
		'							<b class="select-menu-item-text js-select-button-text">h5</b>' +
		'						</a>' +
		'						<a href="#" id="function-h6" class="btn btn-sm minibutton function-button js-navigation-item js-menu-close tooltipped tooltipped-s" aria-label="Header 6 (ctrl+6)">' +
		'							<b class="select-menu-item-text js-select-button-text">h6</b>' +
		'						</a>' +
		'					</div>' +
		'				</div>' +
		'			</div>' +
		'		</div>' +
		'	</div>' +

		/* Link & image; */
		'	<div class="button-group btn-group">' +
		'		<a href="#" id="function-link" class="btn btn-sm minibutton function-button tooltipped tooltipped-ne" aria-label="Link (ctrl+l)">' +
		'			<span class="octicon octicon-link"></span>' +
		'		</a>' +
		'		<a href="#" id="function-image" class="btn btn-sm minibutton function-button tooltipped tooltipped-ne" aria-label="Image (ctrl+g)">' +
		'			<span class="octicon octicon-file-media"></span>' +
		'		</a>' +
		'	</div>' +

		/* Lists (unordered, ordered & task); */
		'	<div class="button-group btn-group">' +
		'		<a href="#" id="function-ul" class="btn btn-sm minibutton function-button tooltipped tooltipped-ne" aria-label="Unordered List (alt+ctrl+u)">' +
		'			<span class="octicon octicon-list-unordered"></span>' +
		'		</a>' +
		'		<a href="#" id="function-ol" class="btn btn-sm minibutton function-button tooltipped tooltipped-ne" aria-label="Ordered List (alt+ctrl+o)">' +
		'			<span class="octicon octicon-list-ordered"></span>' +
		'		</a>' +
		'		<a href="#" id="function-checklist" class="btn btn-sm minibutton function-button tooltipped tooltipped-ne" aria-label="Task List (alt+ctrl+t)">' +
		'			<span class="octicon octicon-checklist"></span>' +
		'		</a>' +
		'	</div>' +

		/* Code (syntax); */
		'	<div class="button-group btn-group">' +
		'		<div class="select-menu js-menu-container js-select-menu  tooltipped tooltipped-ne" aria-label="Code (ctrl+k)">' +
		'			<a href="#" id="function-code" class="btn btn-sm minibutton  function-button">' +
		'				<span class="octicon octicon-code"></span>' +
		'			</a>' +
		'			<div class="select-menu-modal-holder js-menu-content js-navigation-container" style="top:26px; z-index:22;">' +
		'				<div class="select-menu-modal" style="overflow:visible;">' +
		'					<div class="select-menu-header">' +
		'						<span class="select-menu-title">Code syntax</span>' +
		'						<span class="octicon octicon-remove-close js-menu-close"></span>' +
		'					</div>' +
		'					<div class="select-menu-filters">' +
		'						<div class="select-menu-text-filter">' +
		'							<input type="text" placeholder="Filter code syntax..." class="js-filterable-field js-navigation-enable" id="context-code-syntax-filter-field">' +
		'						</div>' +
		'					</div>' +
		'					<div class="code-syntaxes select-menu-list" style="overflow:visible;">' +
		'						<div class="select-menu-no-results">Nothing to show</div>' +
		'					</div>' +
		'				</div>' +
		'			</div>' +
		'			<a href="#" id="function-code" class="btn btn-sm minibutton  select-menu-button js-menu-target  function-button function-dummy" style="width:20px; margin-left:-1px;"></a>' +
		'		</div>' +
		'	</div>' +

		/* Blockquote, horizontal rule & table; */
		'	<div class="button-group btn-group">' +
		'		<a href="#" id="function-blockquote" class="btn btn-sm minibutton function-button tooltipped tooltipped-ne" aria-label="Blockquote (ctrl+q)">' +
		'			<span class="octicon octicon-quote"></span>' +
		'		</a>' +
		'		<a href="#" id="function-rule" class="btn btn-sm minibutton function-button tooltipped tooltipped-ne" aria-label="Horizontal Rule (ctrl+r)">' +
		'			<span class="octicon octicon-horizontal-rule"></span>' +
		'		</a>' +
		'		<a href="#" id="function-table" class="btn btn-sm minibutton function-button tooltipped tooltipped-ne" aria-label="Table (alt+shift+t)">' +
		'			<span class="octicon octicon-three-bars"></span>' +
		'		</a>' +
		'	</div>' +

		/* Snippets; */
		'	<div class="button-group btn-group">' +
		'		<div class="select-menu js-menu-container js-select-menu tooltipped tooltipped-ne" aria-label="Snippets">' +
		'			<a href="#" class="btn btn-sm minibutton select-menu-button js-menu-target" aria-label="Snippets" style="padding-left:7px; padding-right:7px; width:auto; border-bottom-right-radius:3px; border-top-right-radius:3px;">' +
		'				<span class="octicon octicon-pin"></span>' +
		'			</a>' +
		'			<div class="select-menu-modal-holder js-menu-content js-navigation-container" style="top:26px; z-index:22;">' +
		'				<div class="select-menu-modal" style="overflow:visible;">' +
		'					<div class="select-menu-header">' +
		'						<span class="select-menu-title">Snippets</span>' +
		'						<span class="octicon octicon-remove-close js-menu-close"></span>' +
		'					</div>' +
		'					<div class="select-menu-filters">' +
		'						<div class="select-menu-text-filter">' +
		'							<input type="text" placeholder="Filter snippets..." class="js-filterable-field js-navigation-enable" id="context-snippets-filter-field">' +
		'						</div>' +
		'					</div>' +
		'					<div class="select-menu-list" style="overflow:visible;">' +
		'						<div data-filterable-type="substring" data-filterable-for="context-snippets-filter-field">' +
		'							<a href="#" id="function-snippets-tab" class="function-button select-menu-item js-navigation-item tooltipped tooltipped-w" aria-label="Add tab character" style="table-layout:initial;">' +
		'								<span class="select-menu-item-text js-select-button-text">Add tab character</span>' +
		'							</a>' +
		'							<a href="#" id="function-snippets-useragent" class="function-button select-menu-item js-navigation-item tooltipped tooltipped-w" aria-label="Add UserAgent" style="table-layout:initial;">' +
		'								<span class="select-menu-item-text js-select-button-text">Add UserAgent</span>' +
		'							</a>' +
		'							<a href="#" id="function-snippets-contributing" class="function-button select-menu-item js-navigation-item tooltipped tooltipped-w" aria-label="Add contributing message" style="table-layout:initial;">' +
		'								<span class="select-menu-item-text">' +
		'									<span class="js-select-button-text">Contributing</span>' +
		'									<span class="description">Add contributing message</span>' +
		'								</span>' +
		'							</a>' +
		'						</div>' +
		'						<div class="select-menu-no-results">Nothing to show</div>' +
		'					</div>' +
		'				</div>' +
		'			</div>' +
		'		</div>' +
		'	</div>' +

		/* Emoji; */
		'	<div class="button-group btn-group">' +
		'		<div class="select-menu js-menu-container js-select-menu tooltipped tooltipped-ne" aria-label="Emoji">' +
		'			<a href="#" class="btn btn-sm minibutton select-menu-button js-menu-target" aria-label="Emoji" style="padding-left:7px; padding-right:7px; width:auto; border-bottom-right-radius:3px; border-top-right-radius:3px;">' +
		'				<span class="octicon octicon-octoface"></span>' +
		'			</a>' +
		'			<div class="select-menu-modal-holder js-menu-content js-navigation-container" style="top:26px; z-index:22;">' +
		'				<div class="select-menu-modal" style="overflow:visible;">' +
		'					<div class="select-menu-header">' +
		'						<span class="select-menu-title">Emoji</span>' +
		'						<span class="octicon octicon-remove-close js-menu-close"></span>' +
		'					</div>' +
		'					<div class="select-menu-filters">' +
		'						<div class="select-menu-text-filter">' +
		'							<input type="text" placeholder="Filter emoji..." class="js-filterable-field js-navigation-enable" id="context-emoji-filter-field">' +
		'						</div>' +
		'					</div>' +
		'					<div class="suggester select-menu-list" style="overflow:visible;">' +
		'						<div class="select-menu-no-results">Nothing to show</div>' +
		'					</div>' +
		'				</div>' +
		'			</div>' +
		'		</div>' +
		'	</div>' +

		'</div>';
	var toolBarRightHTML =
		/* Clear; */
		'<div style="float:right;">' +
		'	<div class="button-group btn-group">' +
		'		<span id="function-clear" class="btn btn-sm minibutton function-button tooltipped tooltipped-nw" aria-label="Clear (alt+ctrl+x)">' +
		'			<span class="octicon octicon-trashcan"></span>' +
		'		</span>' +
		'	</div>' +
		'</div>';

	// Source: https://github.com/gollum/gollum/blob/9c714e768748db4560bc017cacef4afa0c751a63/lib/gollum/public/gollum/javascript/editor/gollum.editor.js#L516
	function executeAction(definitionObject, commentForm, button) {
		var txt = commentForm.value,
			selPos = {
				start: commentForm.selectionStart,
				end: commentForm.selectionEnd
			},
			selText = txt.substring(selPos.start, selPos.end),
			repText = selText,
			reselect = true,
			cursor = null;

		// execute replacement function;
		if (definitionObject.exec) {
			definitionObject.exec(button, selText, commentForm, function(repText) {
				replaceFieldSelection(commentForm, repText);
			});
			return;
		}

		// execute a search;
		var searchExp = new RegExp(definitionObject.search || /([^\n]+)/gi);

		// replace text;
		if (definitionObject.replace) {
			var rt = definitionObject.replace;
			repText = repText.replace(searchExp, rt);
			repText = repText.replace(/\$[\d]/g, "");
			if (repText === "") {
				cursor = rt.indexOf("$1");
				repText = rt.replace(/\$[\d]/g, "");
				if (cursor === -1) {
					cursor = Math.floor(rt.length / 2);
				}
			}
		}

		// append if necessary;
		if (definitionObject.append) {
			if (repText === selText) {
				reselect = false;
			}
			repText += definitionObject.append;
		}

		if (repText) {
			if (definitionObject.forceNewline === true && (selPos.start > 0 && txt.substr(Math.max(0, selPos.start - 1), 1) !== "\n")) {
				repText = "\n" + repText;
			}
			replaceFieldSelection(commentForm, repText, reselect, cursor);
		}
	}

	// Source: https://github.com/gollum/gollum/blob/9c714e768748db4560bc017cacef4afa0c751a63/lib/gollum/public/gollum/javascript/editor/gollum.editor.js#L708
	function replaceFieldSelection(commentForm, replaceText, reselect, cursorOffset) {
		var txt = commentForm.value,
			selPos = {
				start: commentForm.selectionStart,
				end: commentForm.selectionEnd
			};

		var selectNew = true;
		if (reselect === false) {
			selectNew = false;
		}

		var scrollTop = null;
		if (commentForm.scrollTop) {
			scrollTop = commentForm.scrollTop;
		}

		commentForm.value = txt.substring(0, selPos.start) + replaceText + txt.substring(selPos.end);
		commentForm.focus();

		if (selectNew) {
			if (cursorOffset) {
				commentForm.setSelectionRange(selPos.start + cursorOffset, selPos.start + cursorOffset);
			} else {
				commentForm.setSelectionRange(selPos.start, selPos.start + replaceText.length);
			}
		}

		if (scrollTop) {
			commentForm.scrollTop = scrollTop;
		}
	}

	function isWiki() {
		return /\/wiki\//.test(location.href);
	}

	function isGist() {
		return location.host === "gist.github.com";
	}

	function overrideGollumMarkdown() {
		unsafeWindow.$.GollumEditor.defineLanguage("markdown", MarkDown);
	}

	function unbindGollumFunctions() {
		window.setTimeout(function() {
			unsafeWindow.$(".function-button:not(#function-help)").unbind("click");
		}, 1);
	}

	var buttonEvent = function(e) {
		if (!this.classList.contains("function-dummy")) {
			e.preventDefault();
			executeAction(MarkDown[this.id], this.commentForm, this);
			return false;
		}
	};

	var codeSyntaxTop = ["JavaScript", "Java", "Ruby", "PHP", "Python", "CSS", "C++", "C#", "C", "HTML"]; // https://github.com/blog/2047-language-trends-on-github
	var codeSyntaxList = ["ABAP", "abl", "aconf", "ActionScript", "actionscript 3",
		"actionscript3", "Ada", "ada2005", "ada95", "advpl", "Agda", "ags",
		"AGS Script", "ahk", "Alloy", "AMPL", "Ant Build System", "ANTLR",
		"apache", "ApacheConf", "Apex", "API Blueprint", "APL", "AppleScript",
		"Arc", "Arduino", "as3", "AsciiDoc", "ASP", "AspectJ", "aspx",
		"aspx-vb", "Assembly", "ATS", "ats2", "au3", "Augeas", "AutoHotkey",
		"AutoIt", "AutoIt3", "AutoItScript", "Awk", "b3d", "bash",
		"bash session", "bat", "batch", "Batchfile", "Befunge", "Bison",
		"BitBake", "blitz3d", "BlitzBasic", "BlitzMax", "blitzplus",
		"Bluespec", "bmax", "Boo", "bplus", "Brainfuck", "Brightscript", "Bro",
		"bsdmake", "byond", "C", "C#", "C++", "c++-objdumb", "C-ObjDump",
		"c2hs", "C2hs Haskell", "Cap'n Proto", "Carto", "CartoCSS", "Ceylon",
		"cfc", "cfm", "cfml", "Chapel", "Charity", "chpl", "ChucK", "Cirru",
		"Clarion", "Clean", "clipper", "CLIPS", "Clojure", "CMake", "COBOL",
		"coffee", "coffee-script", "CoffeeScript", "ColdFusion",
		"ColdFusion CFC", "coldfusion html", "Common Lisp", "Component Pascal",
		"console", "Cool", "Coq", "cpp", "Cpp-ObjDump", "Creole", "Crystal",
		"csharp", "CSS", "Cucumber", "Cuda", "Cycript", "Cython", "D",
		"D-ObjDump", "Darcs Patch", "Dart", "dcl", "delphi", "desktop", "Diff",
		"DIGITAL Command Language", "DM", "DNS Zone", "Dockerfile",
		"Dogescript", "dosbatch", "dosini", "dpatch", "DTrace",
		"dtrace-script", "Dylan", "E", "Eagle", "eC", "Ecere Projects", "ECL",
		"ECLiPSe", "edn", "Eiffel", "elisp", "Elixir", "Elm", "emacs",
		"Emacs Lisp", "EmberScript", "erb", "Erlang", "F#", "Factor", "Fancy",
		"Fantom", "Filterscript", "fish", "flex", "FLUX", "Formatted", "Forth",
		"FORTRAN", "foxpro", "Frege", "fsharp", "fundamental", "G-code",
		"Game Maker Language", "GAMS", "GAP", "GAS", "GDScript", "Genshi",
		"Gentoo Ebuild", "Gentoo Eclass", "Gettext Catalog", "gf", "gherkin",
		"GLSL", "Glyph", "Gnuplot", "Go", "Golo", "Gosu", "Grace", "Gradle",
		"Grammatical Framework", "Graph Modeling Language", "Graphviz (DOT)",
		"Groff", "Groovy", "Groovy Server Pages", "gsp", "Hack", "Haml",
		"Handlebars", "Harbour", "Haskell", "Haxe", "hbs", "HCL", "HTML",
		"HTML+Django", "html+django/jinja", "HTML+ERB", "html+jinja",
		"HTML+PHP", "html+ruby", "htmlbars", "htmldjango", "HTTP", "Hy",
		"hylang", "HyPhy", "i7", "IDL", "Idris", "igor", "IGOR Pro", "igorpro",
		"inc", "Inform 7", "inform7", "INI", "Inno Setup", "Io", "Ioke", "irc",
		"IRC log", "irc logs", "Isabelle", "Isabelle ROOT", "J", "Jade",
		"Jasmin", "Java", "java server page", "Java Server Pages",
		"JavaScript", "JFlex", "jruby", "js", "JSON", "JSON5", "JSONiq",
		"JSONLD", "jsp", "JSX", "Julia", "KiCad", "Kit", "Kotlin", "KRL",
		"LabVIEW", "Lasso", "lassoscript", "latex", "Latte", "Lean", "Less",
		"Lex", "LFE", "lhaskell", "lhs", "LilyPond", "Limbo", "Linker Script",
		"Linux Kernel Module", "Liquid", "lisp", "litcoffee", "Literate Agda",
		"Literate CoffeeScript", "Literate Haskell", "live-script",
		"LiveScript", "LLVM", "Logos", "Logtalk", "LOLCODE", "LookML",
		"LoomScript", "ls", "LSL", "Lua", "M", "macruby", "make", "Makefile",
		"Mako", "Markdown", "Mask", "Mathematica", "Matlab", "Maven POM",
		"Max", "max/msp", "maxmsp", "MediaWiki", "Mercury", "mf", "MiniD",
		"Mirah", "mma", "Modelica", "Modula-2", "Module Management System",
		"Monkey", "Moocode", "MoonScript", "MTML", "MUF", "mumps", "mupad",
		"Myghty", "nasm", "NCL", "Nemerle", "nesC", "NetLinx", "NetLinx+ERB",
		"NetLogo", "NewLisp", "Nginx", "nginx configuration file", "Nimrod",
		"Ninja", "Nit", "Nix", "nixos", "NL", "node", "nroff", "NSIS", "Nu",
		"NumPy", "nush", "nvim", "obj-c", "obj-c++", "obj-j", "objc", "objc++",
		"ObjDump", "Objective-C", "Objective-C++", "Objective-J", "objectivec",
		"objectivec++", "objectivej", "objectpascal", "objj", "OCaml",
		"Omgrofl", "ooc", "Opa", "Opal", "OpenCL", "openedge", "OpenEdge ABL",
		"OpenSCAD", "Org", "osascript", "Ox", "Oxygene", "Oz", "Pan",
		"Papyrus", "Parrot", "Parrot Assembly",
		"Parrot Internal Representation", "Pascal", "pasm", "PAWN", "Perl",
		"Perl6", "PHP", "PicoLisp", "PigLatin", "Pike", "pir", "PLpgSQL",
		"PLSQL", "Pod", "PogoScript", "posh", "postscr", "PostScript", "pot",
		"PowerShell", "Processing", "progress", "Prolog", "Propeller Spin",
		"protobuf", "Protocol Buffer", "Protocol Buffers", "Public Key",
		"Puppet", "Pure Data", "PureBasic", "PureScript", "pyrex", "Python",
		"Python traceback", "QMake", "QML", "R", "Racket",
		"Ragel in Ruby Host", "ragel-rb", "ragel-ruby", "rake", "RAML", "raw",
		"Raw token data", "rb", "rbx", "RDoc", "REALbasic", "Rebol", "Red",
		"red/system", "Redcode", "RenderScript", "reStructuredText", "RHTML",
		"RMarkdown", "RobotFramework", "Rouge", "Rscript", "rss", "rst",
		"Ruby", "Rust", "rusthon", "Sage", "salt", "SaltStack", "saltstate",
		"SAS", "Sass", "Scala", "Scaml", "Scheme", "Scilab", "SCSS", "Self",
		"sh", "Shell", "ShellSession", "Shen", "Slash", "Slim", "Smali",
		"Smalltalk", "Smarty", "sml", "SMT", "sourcemod", "SourcePawn",
		"SPARQL", "splus", "SQF", "SQL", "SQLPL", "squeak", "Squirrel",
		"Standard ML", "Stata", "STON", "Stylus", "SuperCollider", "SVG",
		"Swift", "SystemVerilog", "Tcl", "Tcsh", "Tea", "TeX", "Text",
		"Textile", "Thrift", "TOML", "ts", "Turing", "Turtle", "Twig", "TXL",
		"TypeScript", "udiff", "Unified Parallel C", "Unity3D Asset",
		"UnrealScript", "Vala", "vb.net", "vbnet", "VCL", "Verilog", "VHDL",
		"vim", "VimL", "Visual Basic", "Volt", "Vue", "Web Ontology Language",
		"WebIDL", "winbatch", "wisp", "wsdl", "X10", "xBase", "XC", "xhtml",
		"XML", "xml+genshi", "xml+kid", "Xojo", "XPages", "XProc", "XQuery",
		"XS", "xsd", "xsl", "XSLT", "xten", "Xtend", "Yacc", "YAML", "yml",
		"Zephir", "Zimpl", "zsh"
	]; // https://github.com/jerone/UserScripts/issues/18
	var codeSyntaxes = [].concat(codeSyntaxTop, codeSyntaxList).filter(function(a, b, c) {
		return c.indexOf(a) === b;
	});

	function addCodeSyntax(commentForm) {
		var syntaxSuggestions = document.createElement("div");
		syntaxSuggestions.dataset.filterableType = "substring";
		syntaxSuggestions.dataset.filterableFor = "context-code-syntax-filter-field";
		syntaxSuggestions.dataset.filterableLimit = codeSyntaxTop.length; // Show top code syntaxes on open;

		codeSyntaxes.forEach(function(syntax) {
			var syntaxSuggestion = document.createElement("a");
			syntaxSuggestion.setAttribute("href", "#");
			syntaxSuggestion.classList.add("function-button", "select-menu-item", "js-navigation-item");
			syntaxSuggestion.dataset.value = syntax;
			syntaxSuggestion.id = "function-code-syntax";
			syntaxSuggestions.appendChild(syntaxSuggestion);

			var syntaxSuggestionText = document.createElement("span");
			syntaxSuggestionText.classList.add("select-menu-item-text", "js-select-button-text");
			syntaxSuggestionText.appendChild(document.createTextNode(syntax));
			syntaxSuggestion.appendChild(syntaxSuggestionText);
		});

		var suggester = commentForm.parentNode.parentNode.querySelector(".code-syntaxes");
		suggester.appendChild(syntaxSuggestions);
	}

	var suggestionsCache = {};

	function addSuggestions(commentForm) {
		var jssuggester = commentForm.parentNode.parentNode.querySelector(".suggester-container .suggester");
		var url = jssuggester.getAttribute("data-url");

		if (suggestionsCache[url]) {
			parseSuggestions(commentForm, suggestionsCache[url]);
		} else {
			unsafeWindow.$.ajax({
				url: url,
				success: function(suggestionsData) {
					suggestionsCache[url] = suggestionsData;
					parseSuggestions(commentForm, suggestionsData);
				}
			});
		}
	}

	function parseSuggestions(commentForm, suggestionsData) {
		suggestionsData = suggestionsData.replace(/js-navigation-item/g,
			"function-button js-navigation-item select-menu-item");

		var suggestions = document.createElement("div");
		suggestions.innerHTML = suggestionsData;

		var emojiSuggestions = suggestions.querySelector(".emoji-suggestions");
		emojiSuggestions.style.display = "block";
		emojiSuggestions.dataset.filterableType = "substring";
		emojiSuggestions.dataset.filterableFor = "context-emoji-filter-field";
		emojiSuggestions.dataset.filterableLimit = "10";

		var suggester = commentForm.parentNode.parentNode.querySelector(".suggester");
		suggester.style.display = "block";
		suggester.style.marginTop = "0";
		suggester.appendChild(emojiSuggestions);

		var buttons = suggester.querySelectorAll(".function-button");
		Array.prototype.forEach.call(buttons, function(button) {
			button.commentForm = commentForm;
			button.id = "function-emoji";
			button.addEventListener("click", buttonEvent, false);
			unsafeWindow.$(button).on("navigation:keydown", function(e) {
				if (e.hotkey === "enter") {
					buttonEvent.call(this, e);
				}
			});
		});
	}

	function commentFormKeyEvent(commentForm, e) {
		var keys = [];
		if (e.altKey) {
			keys.push('alt');
		}
		if (e.ctrlKey) {
			keys.push('ctrl');
		}
		if (e.shiftKey) {
			keys.push('shift');
		}
		keys.push(String.fromCharCode(e.which).toLowerCase());
		var keyCombination = keys.join('+');

		var action;
		for (var actionName in MarkDown) {
			if (MarkDown[actionName].shortcut && MarkDown[actionName].shortcut.toLowerCase() === keyCombination) {
				action = MarkDown[actionName];
				break;
			}
		}
		if (action) {
			e.preventDefault();
			e.stopPropagation();
			executeAction(action, commentForm, null);
			return false;
		}
	}

	function addToolbar() {
		if (isWiki()) {
			// Override existing language with improved & missing functions and remove existing click events;
			overrideGollumMarkdown();
			unbindGollumFunctions();

			// Remove existing click events when changing languages;
			document.getElementById("wiki_format").addEventListener("change", function() {
				unbindGollumFunctions();

				var buttons = document.querySelectorAll(".comment-form-textarea .function-button");
				Array.prototype.forEach.call(buttons, function(button) {
					button.removeEventListener("click", buttonEvent);
				});
			});
		}

		Array.prototype.forEach.call(document.querySelectorAll(".comment-form-textarea,.js-comment-field"), function(commentForm) {
			var gollumEditor;
			if (commentForm.classList.contains("GithubCommentEnhancer")) {
				gollumEditor = commentForm.previousSibling;
			} else {
				commentForm.classList.add("GithubCommentEnhancer");

				if (isWiki()) {
					gollumEditor = document.getElementById("gollum-editor-function-bar");

					var helpButton = document.createElement("div");
					helpButton.classList.add("button-group", "btn-group");
					helpButton.appendChild(document.getElementById("function-help"));

					var tempLeft = document.createElement("div");
					tempLeft.innerHTML = toolBarLeftHTML;
					gollumEditor.replaceChild(tempLeft.querySelector("#gollum-editor-function-buttons"), document.getElementById("gollum-editor-function-buttons"));

					var tempRight = document.createElement("div");
					tempRight.innerHTML = toolBarRightHTML;
					tempRight.firstElementChild.appendChild(document.createTextNode(" ")); // extra space;
					tempRight.firstElementChild.appendChild(helpButton); // restore the help button;
					gollumEditor.appendChild(tempRight);

					tempLeft = tempRight = null;
				} else {
					gollumEditor = document.createElement("div");
					gollumEditor.innerHTML = toolBarLeftHTML + toolBarRightHTML;
					gollumEditor.id = "gollum-editor-function-bar";
					gollumEditor.style.height = "26px";
					gollumEditor.style.margin = "10px 0";
					gollumEditor.classList.add("active");
					commentForm.parentNode.insertBefore(gollumEditor, commentForm);
				}

				addSuggestions(commentForm);

				addCodeSyntax(commentForm);

				var tabnavExtras = commentForm.parentNode.parentNode.querySelector(".comment-form-head .tabnav-right, .comment-form-head .right");
				if (tabnavExtras) {
					var elem = commentForm;
					while ((elem = elem.parentNode) && elem.nodeType !== 9 && !elem.classList.contains("timeline-inline-comments")) {}
					var sponsoredText = elem !== document ? " Github Comment Enhancer" : " Enhanced by Github Comment Enhancer";
					var sponsored = document.createElement("a");
					sponsored.setAttribute("target", "_blank");
					sponsored.setAttribute("href", "https://github.com/jerone/UserScripts/tree/master/Github_Comment_Enhancer");
					sponsored.classList.add("tabnav-widget", "text", "tabnav-extras", "tabnav-extra");
					var sponsoredIcon = document.createElement("span");
					sponsoredIcon.classList.add("octicon", "octicon-question");
					sponsored.appendChild(sponsoredIcon);
					sponsored.appendChild(document.createTextNode(sponsoredText));
					tabnavExtras.insertBefore(sponsored, tabnavExtras.firstElementChild);
				}
			}

			Array.prototype.forEach.call(gollumEditor.parentNode.querySelectorAll(".function-button"), function(button) {
				button.commentForm = commentForm; // remove event listener doesn't accept `bind`;
				button.addEventListener("click", buttonEvent, false);
				unsafeWindow.$(button).on("navigation:keydown", function(e) {
					if (e.hotkey === "enter") {
						buttonEvent.call(this, e);
					}
				});
			});

			commentForm.addEventListener('keydown', commentFormKeyEvent.bind(this, commentForm));
		});
	}

	/*
	 * to-markdown - an HTML to Markdown converter
	 * Copyright 2011, Dom Christie
	 * Licenced under the MIT licence
	 * Source: https://github.com/domchristie/to-markdown
	 *
	 * Code is altered:
	 * - Added task list support: https://github.com/domchristie/to-markdown/pull/62
	 * - He dependecy is removed
	 */
	var toMarkdown = function(string) {

		var ELEMENTS = [{
			patterns: 'p',
			replacement: function(str, attrs, innerHTML) {
				return innerHTML ? '\n\n' + innerHTML + '\n' : '';
			}
		}, {
			patterns: 'br',
			type: 'void',
			replacement: '  \n'
		}, {
			patterns: 'h([1-6])',
			replacement: function(str, hLevel, attrs, innerHTML) {
				var hPrefix = '';
				for (var i = 0; i < hLevel; i++) {
					hPrefix += '#';
				}
				return '\n\n' + hPrefix + ' ' + innerHTML + '\n';
			}
		}, {
			patterns: 'hr',
			type: 'void',
			replacement: '\n\n* * *\n'
		}, {
			patterns: 'a',
			replacement: function(str, attrs, innerHTML) {
				var href = attrs.match(attrRegExp('href')),
					title = attrs.match(attrRegExp('title'));
				return href ? '[' + innerHTML + ']' + '(' + href[1] + (title && title[1] ? ' "' + title[1] + '"' : '') + ')' : str;
			}
		}, {
			patterns: ['b', 'strong'],
			replacement: function(str, attrs, innerHTML) {
				return innerHTML ? '**' + innerHTML + '**' : '';
			}
		}, {
			patterns: ['i', 'em'],
			replacement: function(str, attrs, innerHTML) {
				return innerHTML ? '_' + innerHTML + '_' : '';
			}
		}, {
			patterns: 'code',
			replacement: function(str, attrs, innerHTML) {
				return innerHTML ? '`' + innerHTML + '`' : '';
			}
		}, {
			patterns: 'img',
			type: 'void',
			replacement: function(str, attrs, innerHTML) {
				var src = attrs.match(attrRegExp('src')),
					alt = attrs.match(attrRegExp('alt')),
					title = attrs.match(attrRegExp('title'));
				return src ? '![' + (alt && alt[1] ? alt[1] : '') + ']' + '(' + src[1] + (title && title[1] ? ' "' + title[1] + '"' : '') + ')' : '';
			}
		}];

		for (var i = 0, len = ELEMENTS.length; i < len; i++) {
			if (typeof ELEMENTS[i].patterns === 'string') {
				string = replaceEls(string, {
					tag: ELEMENTS[i].patterns,
					replacement: ELEMENTS[i].replacement,
					type: ELEMENTS[i].type
				});
			} else {
				for (var j = 0, pLen = ELEMENTS[i].patterns.length; j < pLen; j++) {
					string = replaceEls(string, {
						tag: ELEMENTS[i].patterns[j],
						replacement: ELEMENTS[i].replacement,
						type: ELEMENTS[i].type
					});
				}
			}
		}

		function replaceEls(html, elProperties) {
			var pattern = elProperties.type === 'void' ? '<' + elProperties.tag + '\\b([^>]*)\\/?>' : '<' + elProperties.tag + '\\b([^>]*)>([\\s\\S]*?)<\\/' + elProperties.tag + '>',
				regex = new RegExp(pattern, 'gi'),
				markdown = '';
			if (typeof elProperties.replacement === 'string') {
				markdown = html.replace(regex, elProperties.replacement);
			} else {
				markdown = html.replace(regex, function(str, p1, p2, p3) {
					return elProperties.replacement.call(this, str, p1, p2, p3);
				});
			}
			return markdown;
		}

		function attrRegExp(attr) {
			return new RegExp(attr + '\\s*=\\s*["\']?([^"\']*)["\']?', 'i');
		}

		// Pre code blocks

		string = string.replace(/<pre\b[^>]*>`([\s\S]*?)`<\/pre>/gi, function(str, innerHTML) {
			var text = innerHTML;
			text = text.replace(/^\t+/g, '  '); // convert tabs to spaces (you know it makes sense)
			text = text.replace(/\n/g, '\n    ');
			return '\n\n    ' + text + '\n';
		});

		// Lists

		// Escape numbers that could trigger an ol
		// If there are more than three spaces before the code, it would be in a pre tag
		// Make sure we are escaping the period not matching any character
		string = string.replace(/^(\s{0,3}\d+)\. /g, '$1\\. ');

		// Converts lists that have no child lists (of same type) first, then works its way up
		var noChildrenRegex = /<(ul|ol)\b[^>]*>(?:(?!<ul|<ol)[\s\S])*?<\/\1>/gi;
		while (string.match(noChildrenRegex)) {
			string = string.replace(noChildrenRegex, function(str) {
				return replaceLists(str);
			});
		}

		function replaceLists(html) {

			html = html.replace(/<(ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi, function(str, listType, innerHTML) {
				var lis = innerHTML.split('</li>');
				lis.splice(lis.length - 1, 1);

				for (i = 0, len = lis.length; i < len; i++) {
					if (lis[i]) {
						var prefix = (listType === 'ol') ? (i + 1) + ".  " : "*   ";
						lis[i] = lis[i].replace(/\s*<li[^>]*>([\s\S]*)/i, function(str, innerHTML) {
							innerHTML = innerHTML.replace(/\s*<input[^>]*?(checked[^>]*)?type=['"]?checkbox['"]?[^>]>/, function(inputStr, checked) {
								return checked ? '[X]' : '[ ]';
							});
							innerHTML = innerHTML.replace(/^\s+/, '');
							innerHTML = innerHTML.replace(/\n\n/g, '\n\n    ');
							// indent nested lists
							innerHTML = innerHTML.replace(/\n([ ]*)+(\*|\d+\.) /g, '\n$1    $2 ');
							return prefix + innerHTML;
						});
					}
					lis[i] = lis[i].replace(/(.) +$/m, '$1');
				}
				return lis.join('\n');
			});

			return '\n\n' + html.replace(/[ \t]+\n|\s+$/g, '');
		}

		// Blockquotes
		var deepest = /<blockquote\b[^>]*>((?:(?!<blockquote)[\s\S])*?)<\/blockquote>/gi;
		while (string.match(deepest)) {
			string = string.replace(deepest, function(str) {
				return replaceBlockquotes(str);
			});
		}

		function replaceBlockquotes(html) {
			html = html.replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, function(str, inner) {
				inner = inner.replace(/^\s+|\s+$/g, '');
				inner = cleanUp(inner);
				inner = inner.replace(/^/gm, '> ');
				inner = inner.replace(/^(>([ \t]{2,}>)+)/gm, '> >');
				return inner;
			});
			return html;
		}

		function cleanUp(string) {
			string = string.replace(/^[\t\r\n]+|[\t\r\n]+$/g, ''); // trim leading/trailing whitespace
			string = string.replace(/\n\s+\n/g, '\n\n');
			string = string.replace(/\n{3,}/g, '\n\n'); // limit consecutive linebreaks to 2
			return string;
		}

		return cleanUp(string);
	};

	function getCommentTextarea(replyBtn) {
		var newComment = replyBtn;
		while (newComment && !newComment.classList.contains('js-quote-selection-container')) {
			newComment = newComment.parentNode;
		}
		if (newComment) {
			var lastElementChild = newComment.lastElementChild;
			lastElementChild.classList.add('open');
			newComment = lastElementChild.querySelector(".comment-form-textarea");
		} else {
			newComment = document.querySelector(".timeline-new-comment .comment-form-textarea");
		}
		return newComment;
	}

	function addReplyButtons() {
		Array.prototype.forEach.call(document.querySelectorAll(".comment"), function(comment) {
			var oldReply = comment.querySelector(".GithubCommentEnhancerReply");
			if (oldReply) {
				oldReply.parentNode.removeChild(oldReply);
			}

			var header = comment.querySelector(".timeline-comment-header"),
				actions = comment.querySelector(".timeline-comment-actions");

			if (!header) {
				return;
			}
			if (!actions) {
				actions = document.createElement("div");
				actions.classList.add("timeline-comment-actions");
				header.insertBefore(actions, header.firstElementChild);
			}

			var reply = document.createElement("a");
			reply.setAttribute("href", "#");
			reply.setAttribute("aria-label", "Reply to this comment");
			reply.classList.add("GithubCommentEnhancerReply", "timeline-comment-action", "tooltipped", "tooltipped-ne");
			reply.addEventListener("click", function(e) {
				e.preventDefault();

				var newComment = getCommentTextarea(this);

				var timestamp = comment.querySelector(".timestamp");

				var commentText = comment.querySelector(".comment-form-textarea");
				if (commentText) {
					commentText = commentText.value;
				} else {
					commentText = toMarkdown(comment.querySelector(".comment-body").innerHTML);
				}
				commentText = commentText.trim().split("\n").map(function(line) {
					return "> " + line;
				}).join("\n");

				var text = newComment.value.length > 0 ? "\n" : "";
				text += String.format('[**@{0}**]({1}/{0}) commented on [{2}]({3} "{4} - Replied by Github Comment Enhancer"):\n{5}\n\n',
					comment.querySelector(".author").textContent,
					location.origin,
					timestamp.firstElementChild.getAttribute("title"),
					timestamp.href,
					timestamp.firstElementChild.getAttribute("datetime"),
					commentText);

				newComment.value += text;
				newComment.setSelectionRange(newComment.value.length, newComment.value.length);
				newComment.focus();
			});

			var replyIcon = document.createElement("span");
			replyIcon.classList.add("octicon", "octicon-mail-reply");
			reply.appendChild(replyIcon);

			actions.appendChild(reply);
		});
	}

	// init;
	function init() {
		addToolbar();
		addReplyButtons();
	}
	init();

	// on pjax;
	unsafeWindow.$(document).on("pjax:end", init); // `pjax:end` also runs on history back;

	// For inline comments on commits;
	var files = document.querySelectorAll('.diff-table');
	Array.prototype.forEach.call(files, function(file) {
		file = file.firstElementChild;
		new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.target === file) {
					addToolbar();
				}
			});
		}).observe(file, {
			childList: true,
			subtree: true
		});
	});

})(typeof unsafeWindow !== "undefined" ? unsafeWindow : window);
