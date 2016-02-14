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
// @version     2.8.3
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
						text = isUrl ? "" : selTxt,
						href = isUrl ? selTxt : "";
					unsafeWindow.$.GollumDialog.init({
						title: "Insert Link",
						fields: [{
							id: "text",
							name: "Link Text",
							type: "text",
							value: text
						}, {
							id: "href",
							name: "URL",
							type: "text",
							value: href
						}],
						OK: function(t) {
							if (t.href) {
								next(String.format("[{0}]({1}){2}",
									t.text || t.href,
									t.href, (/\s+$/.test(selText) ? " " : "")));
							}
						}
					});
				},
				shortcut: "ctrl+l"
			},
			"function-image": {
				exec: function(button, selText, commentForm, next) {
					var selTxt = selText.trim(),
						isUrl = selTxt && /(?:https?:\/\/)|(?:www\.)/.test(selTxt),
						url = isUrl ? selTxt : "",
						alt = isUrl ? "" : selTxt;
					unsafeWindow.$.GollumDialog.init({
						title: "Insert Image",
						fields: [{
							id: "url",
							name: "Image URL",
							type: "text",
							value: url
						}, {
							id: "alt",
							name: "Alt Text",
							type: "text",
							value: alt
						}],
						OK: function(t) {
							if (t.url) {
								next(String.format("![{0}]({1}){2}",
									t.alt || t.url,
									t.url, (/\s+$/.test(selText) ? " " : "")));
							}
						}
					});
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
		'<div class="gollum-editor-function-buttons" style="float: left;">' +

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
		'			<a href="#" id="function-h1" class="btn btn-sm minibutton select-menu-button js-menu-target function-button function-dummy" aria-label="Headers" style="padding-left:7px; padding-right:7px; width:auto; border-bottom-right-radius:3px; border-top-right-radius:3px;">' +
		'				<svg class="octicon octicon-text-size" height="16" viewBox="0 0 18 16" width="19"><path d="M17.97 14h-2.25l-0.95-3.25H10.7l-0.95 3.25H7.5l-0.69-2.33H3.53l-0.7 2.33H0.66l3.3-9.59h2.5l2.17 6.34 2.89-8.75h2.52l3.94 12zM6.36 10.13s-1.02-3.61-1.17-4.11h-0.08l-1.13 4.11h2.38z m7.92-1.05l-1.52-5.42h-0.06l-1.5 5.42h3.08z"></path></svg>' +
		'			</a>' +
		'			<div class="select-menu-modal-holder js-menu-content js-navigation-container" style="top:26px; z-index:22;">' +
		'				<div class="select-menu-modal" style="width:auto; overflow:visible;">' +
		'					<div class="select-menu-header">' +
		'						<span class="select-menu-title">Choose header</span>' +
		'						<svg class="octicon octicon-remove-close js-menu-close" height="16" viewBox="0 0 12 16" width="12" xmlns="http://www.w3.org/2000/svg"><path d="M7.48 8l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75-1.48-1.48 3.75-3.75L0.77 4.25l1.48-1.48 3.75 3.75 3.75-3.75 1.48 1.48-3.75 3.75z" /></svg>' +
		'					</div>' +
		'					<div class="button-group btn-group" style="min-width:175px;">' +
		'						<a href="#" id="function-h1" class="btn btn-sm minibutton function-button js-menu-close tooltipped tooltipped-s" aria-label="Header 1 (ctrl+1)">' +
		'							h1' +
		'						</a>' +
		'						<a href="#" id="function-h2" class="btn btn-sm minibutton function-button js-menu-close tooltipped tooltipped-s" aria-label="Header 2 (ctrl+2)">' +
		'							h2' +
		'						</a>' +
		'						<a href="#" id="function-h3" class="btn btn-sm minibutton function-button js-menu-close tooltipped tooltipped-s" aria-label="Header 3 (ctrl+3)">' +
		'							h3' +
		'						</a>' +
		'						<a href="#" id="function-h4" class="btn btn-sm minibutton function-button js-menu-close tooltipped tooltipped-s" aria-label="Header 4 (ctrl+4)">' +
		'							h4' +
		'						</a>' +
		'						<a href="#" id="function-h5" class="btn btn-sm minibutton function-button js-menu-close tooltipped tooltipped-s" aria-label="Header 5 (ctrl+5)">' +
		'							h5' +
		'						</a>' +
		'						<a href="#" id="function-h6" class="btn btn-sm minibutton function-button js-menu-close tooltipped tooltipped-s" aria-label="Header 6 (ctrl+6)">' +
		'							h6' +
		'						</a>' +
		'					</div>' +
		'				</div>' +
		'			</div>' +
		'		</div>' +
		'	</div>' +

		/* Link & image; */
		'	<div class="button-group btn-group">' +
		'		<a href="#" id="function-link" class="btn btn-sm minibutton function-button tooltipped tooltipped-ne" aria-label="Link (ctrl+l)">' +
		'			<svg class="octicon octicon-link" height="16" viewBox="0 0 16 16" width="17" xmlns="http://www.w3.org/2000/svg"><path d="M4 9h1v1h-1c-1.5 0-3-1.69-3-3.5s1.55-3.5 3-3.5h4c1.45 0 3 1.69 3 3.5 0 1.41-0.91 2.72-2 3.25v-1.16c0.58-0.45 1-1.27 1-2.09 0-1.28-1.02-2.5-2-2.5H4c-0.98 0-2 1.22-2 2.5s1 2.5 2 2.5z m9-3h-1v1h1c1 0 2 1.22 2 2.5s-1.02 2.5-2 2.5H9c-0.98 0-2-1.22-2-2.5 0-0.83 0.42-1.64 1-2.09v-1.16c-1.09 0.53-2 1.84-2 3.25 0 1.81 1.55 3.5 3 3.5h4c1.45 0 3-1.69 3-3.5s-1.5-3.5-3-3.5z" /></svg>' +
		'		</a>' +
		'		<a href="#" id="function-image" class="btn btn-sm minibutton function-button tooltipped tooltipped-ne" aria-label="Image (ctrl+g)">' +
		'			<svg class="octicon octicon-file-media" height="16" viewBox="0 0 12 16" width="13" xmlns="http://www.w3.org/2000/svg"><path d="M6 5h2v2H6V5z m6-0.5v9.5c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V2c0-0.55 0.45-1 1-1h7.5l3.5 3.5z m-1 0.5L8 2H1v11l3-5 2 4 2-2 3 3V5z" /></svg>' +
		'		</a>' +
		'	</div>' +

		/* Lists (unordered, ordered & task); */
		'	<div class="button-group btn-group">' +
		'		<a href="#" id="function-ul" class="btn btn-sm minibutton function-button tooltipped tooltipped-ne" aria-label="Unordered List (alt+ctrl+u)">' +
		'			<svg class="octicon octicon-list-unordered" height="16" viewBox="0 0 12 16" width="13"><path d="M2 13c0 0.59 0 1-0.59 1H0.59c-0.59 0-0.59-0.41-0.59-1s0-1 0.59-1h0.81c0.59 0 0.59 0.41 0.59 1z m2.59-9h6.81c0.59 0 0.59-0.41 0.59-1s0-1-0.59-1H4.59c-0.59 0-0.59 0.41-0.59 1s0 1 0.59 1zM1.41 7H0.59c-0.59 0-0.59 0.41-0.59 1s0 1 0.59 1h0.81c0.59 0 0.59-0.41 0.59-1s0-1-0.59-1z m0-5H0.59c-0.59 0-0.59 0.41-0.59 1s0 1 0.59 1h0.81c0.59 0 0.59-0.41 0.59-1s0-1-0.59-1z m10 5H4.59c-0.59 0-0.59 0.41-0.59 1s0 1 0.59 1h6.81c0.59 0 0.59-0.41 0.59-1s0-1-0.59-1z m0 5H4.59c-0.59 0-0.59 0.41-0.59 1s0 1 0.59 1h6.81c0.59 0 0.59-0.41 0.59-1s0-1-0.59-1z"></path></svg>' +
		'		</a>' +
		'		<a href="#" id="function-ol" class="btn btn-sm minibutton function-button tooltipped tooltipped-ne" aria-label="Ordered List (alt+ctrl+o)">' +
		'			<svg class="octicon octicon-list-ordered" height="16" viewBox="0 0 12 16" width="13"><path d="M12 13c0 0.59 0 1-0.59 1H4.59c-0.59 0-0.59-0.41-0.59-1s0-1 0.59-1h6.81c0.59 0 0.59 0.41 0.59 1zM4.59 4h6.81c0.59 0 0.59-0.41 0.59-1s0-1-0.59-1H4.59c-0.59 0-0.59 0.41-0.59 1s0 1 0.59 1z m6.81 3H4.59c-0.59 0-0.59 0.41-0.59 1s0 1 0.59 1h6.81c0.59 0 0.59-0.41 0.59-1s0-1-0.59-1zM2 1H1.28C0.98 1.19 0.7 1.25 0.25 1.34v0.66h0.75v2.14H0.16v0.86h2.84v-0.86h-1V1z m0.25 8.13c-0.17 0-0.45 0.03-0.66 0.06 0.53-0.56 1.14-1.25 1.14-1.89-0.02-0.78-0.56-1.3-1.36-1.3-0.59 0-0.97 0.2-1.38 0.64l0.58 0.58c0.19-0.19 0.38-0.38 0.64-0.38 0.28 0 0.48 0.16 0.48 0.52 0 0.53-0.77 1.2-1.7 2.06v0.58h3l-0.09-0.88h-0.66z m-0.08 3.78v-0.03c0.44-0.19 0.64-0.47 0.64-0.86 0-0.7-0.56-1.11-1.44-1.11-0.48 0-0.89 0.19-1.28 0.52l0.55 0.64c0.25-0.2 0.44-0.31 0.69-0.31 0.27 0 0.42 0.13 0.42 0.36 0 0.27-0.2 0.44-0.86 0.44v0.75c0.83 0 0.98 0.17 0.98 0.47 0 0.25-0.23 0.38-0.58 0.38-0.28 0-0.56-0.14-0.81-0.38L0 14.44c0.3 0.36 0.77 0.56 1.41 0.56 0.83 0 1.53-0.41 1.53-1.16 0-0.5-0.31-0.81-0.77-0.94z"></path></svg>' +
		'		</a>' +
		'		<a href="#" id="function-checklist" class="btn btn-sm minibutton function-button tooltipped tooltipped-ne" aria-label="Task List (alt+ctrl+t)">' +
		'			<svg class="octicon octicon-tasklist" height="16" viewBox="0 0 16 16" width="17"><path d="M15.41 9H7.59c-0.59 0-0.59-0.41-0.59-1s0-1 0.59-1h7.81c0.59 0 0.59 0.41 0.59 1s0 1-0.59 1zM9.59 4c-0.59 0-0.59-0.41-0.59-1s0-1 0.59-1h5.81c0.59 0 0.59 0.41 0.59 1s0 1-0.59 1H9.59zM0 3.91l1.41-1.3 1.59 1.59L7.09 0l1.41 1.41-5.5 5.5L0 3.91z m7.59 8.09h7.81c0.59 0 0.59 0.41 0.59 1s0 1-0.59 1H7.59c-0.59 0-0.59-0.41-0.59-1s0-1 0.59-1z"></path></svg>' +
		'		</a>' +
		'	</div>' +

		/* Code (syntax); */
		'	<div class="button-group btn-group">' +
		'		<div class="select-menu js-menu-container js-select-menu tooltipped tooltipped-ne" aria-label="Code (ctrl+k)">' +
		'			<a href="#" id="function-code" class="btn btn-sm minibutton function-button">' +
		'				<svg class="octicon octicon-code" height="16" viewBox="0 0 14 16" width="15"><path d="M9.5 3l-1.5 1.5 3.5 3.5L8 11.5l1.5 1.5 4.5-5L9.5 3zM4.5 3L0 8l4.5 5 1.5-1.5L2.5 8l3.5-3.5L4.5 3z"></path></svg>' +
		'			</a>' +
		'			<div class="select-menu-modal-holder js-menu-content js-navigation-container" style="top:26px; z-index:22;">' +
		'				<div class="select-menu-modal" style="overflow:visible;">' +
		'					<div class="select-menu-header">' +
		'						<span class="select-menu-title">Code syntax</span>' +
		'						<svg class="octicon octicon-remove-close js-menu-close" height="16" viewBox="0 0 12 16" width="12" xmlns="http://www.w3.org/2000/svg"><path d="M7.48 8l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75-1.48-1.48 3.75-3.75L0.77 4.25l1.48-1.48 3.75 3.75 3.75-3.75 1.48 1.48-3.75 3.75z" /></svg>' +
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
		'			<a href="#" id="function-code" class="btn btn-sm minibutton select-menu-button js-menu-target function-button function-dummy" style="width:20px; margin-left:-1px;"></a>' +
		'		</div>' +
		'	</div>' +

		/* Blockquote, horizontal rule & table; */
		'	<div class="button-group btn-group">' +
		'		<a href="#" id="function-blockquote" class="btn btn-sm minibutton function-button tooltipped tooltipped-ne" aria-label="Blockquote (ctrl+q)">' +
		'			<svg class="octicon octicon-quote" height="16" viewBox="0 0 14 16" width="15"><path d="M6.16 3.17C3.73 4.73 2.55 6.34 2.55 9.03c0.16-0.05 0.3-0.05 0.44-0.05 1.27 0 2.5 0.86 2.5 2.41 0 1.61-1.03 2.61-2.5 2.61C1.09 14 0 12.48 0 9.75 0 5.95 1.75 3.22 5.02 1.33l1.14 1.84z m7 0C10.73 4.73 9.55 6.34 9.55 9.03c0.16-0.05 0.3-0.05 0.44-0.05 1.27 0 2.5 0.86 2.5 2.41 0 1.61-1.03 2.61-2.5 2.61-1.89 0-2.98-1.52-2.98-4.25 0-3.8 1.75-6.53 5.02-8.42l1.14 1.84z"></path></svg>' +
		'		</a>' +
		'		<a href="#" id="function-rule" class="btn btn-sm minibutton function-button tooltipped tooltipped-ne" aria-label="Horizontal Rule (ctrl+r)">' +
		'			<svg class="octicon octicon-horizontal-rule" height="16" viewBox="0 0 10 16" width="11" xmlns="http://www.w3.org/2000/svg"><path d="M1 7h2v2h1V3h-1v3H1V3H0v6h1V7z m9 2V7h-1v2h1z m0-3V4h-1v2h1z m-3 0V4h2v-1H6v6h1V7h2v-1H7zM0 13h10V11H0v2z" /></svg>' +
		'		</a>' +
		'		<a href="#" id="function-table" class="btn btn-sm minibutton function-button tooltipped tooltipped-ne" aria-label="Table (alt+shift+t)">' +
		'			<svg class="octicon octicon-three-bars" height="16" viewBox="0 0 12 16" width="13" xmlns="http://www.w3.org/2000/svg"><path d="M11.41 9H0.59c-0.59 0-0.59-0.41-0.59-1s0-1 0.59-1h10.81c0.59 0 0.59 0.41 0.59 1s0 1-0.59 1z m0-4H0.59c-0.59 0-0.59-0.41-0.59-1s0-1 0.59-1h10.81c0.59 0 0.59 0.41 0.59 1s0 1-0.59 1zM0.59 11h10.81c0.59 0 0.59 0.41 0.59 1s0 1-0.59 1H0.59c-0.59 0-0.59-0.41-0.59-1s0-1 0.59-1z" /></svg>' +
		'		</a>' +
		'	</div>' +

		/* Snippets; */
		'	<div class="button-group btn-group">' +
		'		<div class="select-menu js-menu-container js-select-menu tooltipped tooltipped-ne" aria-label="Snippets">' +
		'			<a href="#" class="btn btn-sm minibutton select-menu-button js-menu-target" aria-label="Snippets" style="padding-left:7px; padding-right:7px; width:auto; border-bottom-right-radius:3px; border-top-right-radius:3px;">' +
		'				<svg class="octicon octicon-pin" height="16" viewBox="0 0 16 16" width="17" xmlns="http://www.w3.org/2000/svg"><path d="M10 1.2v0.8l0.5 1-4.5 3H2.2c-0.44 0-0.67 0.53-0.34 0.86l3.14 3.14L1 15l5-4 3.14 3.14c0.33 0.33 0.86 0.09 0.86-0.34V10l3-4.5 1 0.5h0.8c0.44 0 0.67-0.53 0.34-0.86L10.86 0.86c-0.33-0.33-0.86-0.09-0.86 0.34z" /></svg>' +
		'			</a>' +
		'			<div class="select-menu-modal-holder js-menu-content js-navigation-container" style="top:26px; z-index:22;">' +
		'				<div class="select-menu-modal" style="overflow:visible;">' +
		'					<div class="select-menu-header">' +
		'						<span class="select-menu-title">Snippets</span>' +
		'						<svg class="octicon octicon-remove-close js-menu-close" height="16" viewBox="0 0 12 16" width="12" xmlns="http://www.w3.org/2000/svg"><path d="M7.48 8l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75-1.48-1.48 3.75-3.75L0.77 4.25l1.48-1.48 3.75 3.75 3.75-3.75 1.48 1.48-3.75 3.75z" /></svg>' +
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
		'	<div class="button-group btn-group suggester-function">' +
		'		<div class="select-menu js-menu-container js-select-menu tooltipped tooltipped-ne" aria-label="Emoji">' +
		'			<a href="#" class="btn btn-sm minibutton select-menu-button js-menu-target" aria-label="Emoji" style="padding-left:7px; padding-right:7px; width:auto; border-bottom-right-radius:3px; border-top-right-radius:3px;">' +
		'				<svg class="octicon octicon-smiley" height="16" viewBox="0 0 16 16" width="17" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8S12.42 0 8 0z m4.81 12.81c-0.63 0.63-1.36 1.11-2.17 1.45-0.83 0.36-1.72 0.53-2.64 0.53s-1.81-0.17-2.64-0.53c-0.81-0.34-1.55-0.83-2.17-1.45s-1.11-1.36-1.45-2.17c-0.36-0.83-0.53-1.72-0.53-2.64s0.17-1.81 0.53-2.64c0.34-0.81 0.83-1.55 1.45-2.17s1.36-1.11 2.17-1.45c0.83-0.36 1.72-0.53 2.64-0.53s1.81 0.17 2.64 0.53c0.81 0.34 1.55 0.83 2.17 1.45s1.11 1.36 1.45 2.17c0.36 0.83 0.53 1.72 0.53 2.64s-0.17 1.81-0.53 2.64c-0.34 0.81-0.83 1.55-1.45 2.17zM4 5.8v-0.59c0-0.66 0.53-1.19 1.2-1.19h0.59c0.66 0 1.19 0.53 1.19 1.19v0.59c0 0.67-0.53 1.2-1.19 1.2h-0.59c-0.67 0-1.2-0.53-1.2-1.2z m5 0v-0.59c0-0.66 0.53-1.19 1.2-1.19h0.59c0.66 0 1.19 0.53 1.19 1.19v0.59c0 0.67-0.53 1.2-1.19 1.2h-0.59c-0.67 0-1.2-0.53-1.2-1.2z m4 4.2c-0.72 1.88-2.91 3-5 3s-4.28-1.13-5-3c-0.14-0.39 0.23-1 0.66-1h8.59c0.41 0 0.89 0.61 0.75 1z" /></svg>' +
		'			</a>' +
		'			<div class="select-menu-modal-holder js-menu-content js-navigation-container" style="top:26px; z-index:22;">' +
		'				<div class="select-menu-modal" style="overflow:visible;">' +
		'					<div class="select-menu-header">' +
		'						<span class="select-menu-title">Emoji</span>' +
		'						<svg class="octicon octicon-remove-close js-menu-close" height="16" viewBox="0 0 12 16" width="12" xmlns="http://www.w3.org/2000/svg"><path d="M7.48 8l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75-1.48-1.48 3.75-3.75L0.77 4.25l1.48-1.48 3.75 3.75 3.75-3.75 1.48 1.48-3.75 3.75z" /></svg>' +
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
		'			<svg class="octicon octicon-trashcan" height="16" viewBox="0 0 12 16" width="13" xmlns="http://www.w3.org/2000/svg"><path d="M10 2H8c0-0.55-0.45-1-1-1H4c-0.55 0-1 0.45-1 1H1c-0.55 0-1 0.45-1 1v1c0 0.55 0.45 1 1 1v9c0 0.55 0.45 1 1 1h7c0.55 0 1-0.45 1-1V5c0.55 0 1-0.45 1-1v-1c0-0.55-0.45-1-1-1z m-1 12H2V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9z m1-10H1v-1h9v1z" /></svg>' +
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

	//function isGist() {
	//	return "gist.github.com" === location.host;
	//}

	function overrideGollumMarkdown() {
		unsafeWindow.$.GollumEditor.defineLanguage("markdown", MarkDown);
	}

	function unbindGollumFunctions() {
		window.setTimeout(function() {
			unsafeWindow.$(".function-button:not(#function-help)").unbind("click");
		}, 1);
	}

	var buttonEvent = function(e) {
		if (!this.classList.contains("disabled") && !this.classList.contains("function-dummy")) {
			e.preventDefault();
			executeAction(MarkDown[this.id], this.commentForm, this);
			return false;
		}
	};

	// The suggester container needs extra margin to move the menu below the text because of the added toolbar.
	function fixSuggesterMenu(commentForm) {
		commentForm.parentNode.parentNode.querySelector(".suggester-container").style.marginTop = "36px";
	}

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

	function addSponsorLink() {
		var sponsoredText = " Enhanced by Github Comment Enhancer";
		var sponsored = document.createElement("a");
		sponsored.setAttribute("target", "_blank");
		sponsored.setAttribute("href", "https://github.com/jerone/UserScripts/tree/master/Github_Comment_Enhancer#readme");
		sponsored.classList.add("tabnav-extra");
		sponsored.style.cssFloat = "right";
		var sponsoredSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		sponsoredSvg.classList.add("octicon", "octicon-question");
		sponsoredSvg.setAttribute("height", "16");
		sponsoredSvg.setAttribute("width", "16");
		sponsored.appendChild(sponsoredSvg);
		var sponsoredPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
		sponsoredPath.setAttribute("d", "M6 10h2v2H6V10z m4-3.5c0 2.14-2 2.5-2 2.5H6c0-0.55 0.45-1 1-1h0.5c0.28 0 0.5-0.22 0.5-0.5v-1c0-0.28-0.22-0.5-0.5-0.5h-1c-0.28 0-0.5 0.22-0.5 0.5v0.5H4c0-1.5 1.5-3 3-3s3 1 3 2.5zM7 2.3c3.14 0 5.7 2.56 5.7 5.7S10.14 13.7 7 13.7 1.3 11.14 1.3 8s2.56-5.7 5.7-5.7m0-1.3C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7S10.86 1 7 1z");
		sponsoredSvg.appendChild(sponsoredPath);
		sponsored.appendChild(document.createTextNode(sponsoredText));
		return sponsored;
	}

	function removeGitHubToolbar(commentForm) {
		var toolbar = commentForm.parentNode.parentNode.querySelector(".toolbar-commenting");
		if (toolbar) {
			toolbar.parentNode.replaceChild(addSponsorLink(), toolbar);
		}
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
		var editors = document.querySelectorAll(".comment-form-textarea,.js-comment-field");
		if (editors.length > 0) {

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

			Array.prototype.forEach.call(editors, function(commentForm) {
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
						gollumEditor.replaceChild(tempLeft, document.getElementById("gollum-editor-function-buttons"));

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

						removeGitHubToolbar(commentForm);
					}

					// Execute next block only when suggester is available;
					if (commentForm.parentNode.parentNode.querySelector(".suggester-container")) {
						fixSuggesterMenu(commentForm);

						addSuggestions(commentForm);
					} else {
						Array.prototype.forEach.call(gollumEditor.parentNode.querySelectorAll(".suggester-function"), function(button) {
							button.style.display = "none";
						});
					}

					addCodeSyntax(commentForm);
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
	}

	function overrideGollumDialog() {
		if (unsafeWindow.$.GollumDialog === undefined) {
			(function(e) {
				var t = {
					markupCreated: !1,
					markup: "",
					attachEvents: function(o) {
						e("#gollum-dialog-action-ok").click(function(e) {
								t.eventOK(e, o);
							}),
							e("#gollum-dialog-action-cancel").click(t.eventCancel),
							e('#gollum-dialog-dialog input[type="text"]').keydown(function(e) {
								13 === e.keyCode && t.eventOK(e, o);
							});
					},
					detachEvents: function() {
						e("#gollum-dialog-action-ok").unbind("click"),
							e("#gollum-dialog-action-cancel").unbind("click");
					},
					createFieldMarkup: function(e) {
						for (var o = "<fieldset>", n = 0; n < e.length; n++)
							if ("object" === typeof e[n]) {
								switch (o += '<div class="field">',
									e[n].type) {
									case "text":
										o += t.createFieldText(e[n]);
								}
								o += "</div>";
							}
						return o += "</fieldset>";
					},
					createFieldText: function(e) {
						var t = "";
						return e.name && (t += "<label",
								e.id && (t += ' for="' + e.name + '"'),
								t += ">" + e.name + "</label>"),
							t += '<input type="text"',
							e.id && (t += ' name="' + e.id + '"',
								"code" === e.type && (t += ' class="code"'),
								e.value && (t += ' value="' + e.value + '"'),
								t += ' id="gollum-dialog-dialog-generated-field-' + e.id + '">'),
							t;
					},
					createMarkup: function(o, n) {
						return t.markupCreated = !0,
							e.facebox ? '<div id="gollum-dialog-dialog"><div id="gollum-dialog-dialog-title"><h4>' + o + '</h4></div><div id="gollum-dialog-dialog-body">' + n + '</div><div id="gollum-dialog-dialog-buttons"><a href="#" title="Cancel" id="gollum-dialog-action-cancel" class="gollum-minibutton">Cancel</a><a href="#" title="OK" id="gollum-dialog-action-ok" class="gollum-minibutton">OK</a></div></div>' : '<div id="gollum-dialog-dialog"><div id="gollum-dialog-dialog-inner"><div id="gollum-dialog-dialog-bg"><div id="gollum-dialog-dialog-title"><h4>' + o + '</h4></div><div id="gollum-dialog-dialog-body">' + n + '</div><div id="gollum-dialog-dialog-buttons"><a href="#" title="Cancel" id="gollum-dialog-action-cancel" class="minibutton">Cancel</a><a href="#" title="OK" id="gollum-dialog-action-ok" class="minibutton">OK</a></div></div></div></div>';
					},
					eventCancel: function(e) {
						e.preventDefault(),
							t.hide();
					},
					eventOK: function(o, n) {
						o.preventDefault();
						var a = [];
						e("#gollum-dialog-dialog-body input").each(function() {
								a[e(this).attr("name")] = e(this).val();
							}),
							n && "function" === typeof n && n(a),
							t.hide();
					},
					hide: function() {
						e.facebox ? (t.markupCreated = !1,
							e(document).trigger("close.facebox"),
							t.detachEvents()) : e.browser.msie ? (e("#gollum-dialog-dialog").hide().removeClass("active"),
							e("select").css("visibility", "visible")) : e("#gollum-dialog-dialog").animate({
							opacity: 0
						}, {
							duration: 200,
							complete: function() {
								e("#gollum-dialog-dialog").removeClass("active");
							}
						});
					},
					init: function(o) {
						var n = "",
							a = "";
						o && "object" === typeof o && (o.body && "string" === typeof o.body && (a = "<p>" + o.body + "</p>"),
							o.fields && "object" === typeof o.fields && (a += t.createFieldMarkup(o.fields)),
							o.title && "string" === typeof o.title && (n = o.title),
							t.markupCreated && (e.facebox ? e(document).trigger("close.facebox") : e("#gollum-dialog-dialog").remove()),
							t.markup = t.createMarkup(n, a),
							e.facebox ? e(document).bind("reveal.facebox", function() {
								o.OK && "function" === typeof o.OK && (t.attachEvents(o.OK),
									e(e('#facebox input[type="text"]').get(0)).focus());
							}) : (e("body").append(t.markup),
								o.OK && "function" === typeof o.OK && t.attachEvents(o.OK)),
							t.show());
					},
					show: function() {
						t.markupCreated && (e.facebox ? e.facebox(t.markup) : e.browser.msie ? (e("#gollum-dialog.dialog").addClass("active"),
							t.position(),
							e("select").css("visibility", "hidden")) : (e("#gollum-dialog.dialog").css("display", "none"),
							e("#gollum-dialog-dialog").animate({
								opacity: 0
							}, {
								duration: 0,
								complete: function() {
									e("#gollum-dialog-dialog").css("display", "block"),
										t.position(),
										e("#gollum-dialog-dialog").animate({
											opacity: 1
										}, {
											duration: 500
										});
								}
							})));
					},
					position: function() {
						var t = e("#gollum-dialog-dialog-inner").height();
						e("#gollum-dialog-dialog-inner").css("height", t + "px").css("margin-top", -1 * parseInt(t / 2));
					}
				};
				e.facebox && e(document).bind("reveal.facebox", function() {
						e("#facebox img.close_image").remove();
					}),
					e.GollumDialog = t;
			})(unsafeWindow.$);
		} else {
			unsafeWindow.$.GollumEditor.Dialog.createFieldText = unsafeWindow.$.GollumDialog.createFieldText = function(e) {
				var t = "";
				return e.name && (t += "<label",
						e.id && (t += ' for="' + e.name + '"'),
						t += ">" + e.name + "</label>"),
					t += '<input type="text"',
					e.value && (t += ' value="' + e.value + '"'),
					e.id && (t += ' name="' + e.id + '"',
						"code" === e.type && (t += ' class="code"'),
						t += ' id="gollum-dialog-dialog-generated-field-' + e.id + '">'),
					t;
			};
		}
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
			replacement: function(str, attrs) {
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
			string = string.replace(noChildrenRegex, replaceLists);
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
			string = string.replace(deepest, replaceBlockquotes);
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

			var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svg.classList.add("octicon", "octicon-mail-reply");
			svg.setAttribute("height", "16");
			svg.setAttribute("width", "16");
			reply.appendChild(svg);
			var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
			path.setAttribute("d", "M6 2.5l-6 4.5 6 4.5v-3c1.73 0 5.14 0.95 6 4.38 0-4.55-3.06-7.05-6-7.38v-3z");
			svg.appendChild(path);

			actions.appendChild(reply);
		});
	}

	// init;
	function init() {
		addToolbar();
		addReplyButtons();
	}
	overrideGollumDialog();
	init();

	// on pjax;
	unsafeWindow.$(document).on("pjax:end", init); // `pjax:end` also runs on history back;

	// For inline comments on commits;
	var files = document.querySelectorAll('.diff-table');
	Array.prototype.forEach.call(files, function(file) {
		file = file.querySelector(".diff-table > tbody");
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
