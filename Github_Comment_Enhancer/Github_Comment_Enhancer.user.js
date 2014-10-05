// ==UserScript==
// @id          Github_Comment_Enhancer@https://github.com/jerone/UserScripts
// @name        Github Comment Enhancer
// @namespace   https://github.com/jerone/UserScripts
// @description Enhances Github comments
// @author      jerone
// @copyright   2014+, jerone (http://jeroenvanwarmerdam.nl)
// @license     GNU GPLv3
// @homepage    https://github.com/jerone/UserScripts/tree/master/Github_Comment_Enhancer
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Github_Comment_Enhancer
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Github_Comment_Enhancer/Github_Comment_Enhancer.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Github_Comment_Enhancer/Github_Comment_Enhancer.user.js
// @version     2.0.2
// @grant       none
// @run-at      document-end
// @include     https://github.com/*/*/issues
// @include     https://github.com/*/*/issues/*
// @include     https://github.com/*/*/pulls
// @include     https://github.com/*/*/pull/*
// @include     https://github.com/*/*/commit/*
// @include     https://github.com/*/*/compare/*
// @include     https://github.com/*/*/wiki/*
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

	// Source: https://github.com/gollum/gollum/blob/9c714e768748db4560bc017cacef4afa0c751a63/lib/gollum/public/gollum/javascript/editor/langs/markdown.js
	var MarkDown = (function MarkDown() {
		return {
			"function-bold": {
				search: /^(\s*)([\s\S]*?)(\s*)$/g,
				replace: "$1**$2**$3"
			},
			"function-italic": {
				search: /^(\s*)([\s\S]*?)(\s*)$/g,
				replace: "$1_$2_$3"
			},
			"function-strikethrough": {
				search: /^(\s*)([\s\S]*?)(\s*)$/g,
				replace: "$1~~$2~~$3"
			},

			"function-h1": {
				search: /(.+)([\n]?)/g,
				replace: "# $1$2",
				forceNewline: true
			},
			"function-h2": {
				search: /(.+)([\n]?)/g,
				replace: "## $1$2",
				forceNewline: true
			},
			"function-h3": {
				search: /(.+)([\n]?)/g,
				replace: "### $1$2",
				forceNewline: true
			},
			"function-h4": {
				search: /(.+)([\n]?)/g,
				replace: "#### $1$2",
				forceNewline: true
			},
			"function-h5": {
				search: /(.+)([\n]?)/g,
				replace: "##### $1$2",
				forceNewline: true
			},
			"function-h6": {
				search: /(.+)([\n]?)/g,
				replace: "###### $1$2",
				forceNewline: true
			},

			"function-link": {
				exec: function(txt, selText, commentForm, next) {
					var selTxt = selText.trim(),
						isUrl = selTxt && /(?:https?:\/\/)|(?:www\.)/.test(selTxt),
						href = window.prompt("Link href:", isUrl ? selTxt : ""),
						text = window.prompt("Link text:", isUrl ? "" : selTxt);
					if (href) {
						next(String.format("[{0}]({1}){2}", text || href, href, (/\s+$/.test(selText) ? " " : "")));
					}
				}
			},
			"function-image": {
				exec: function(txt, selText, commentForm, next) {
					var selTxt = selText.trim(),
						isUrl = selTxt && /(?:https?:\/\/)|(?:www\.)/.test(selTxt),
						href = window.prompt("Image href:", isUrl ? selTxt : ""),
						text = window.prompt("Image text:", isUrl ? "" : selTxt);
					if (href) {
						next(String.format("![{0}]({1}){2}", text || href, href, (/\s+$/.test(selText) ? " " : "")));
					}
				}
			},

			"function-ul": {
				search: /(.+)([\n]?)/g,
				replace: "* $1$2",
				forceNewline: true
			},
			"function-ol": {
				exec: function(txt, selText, commentForm, next) {
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
				}
			},
			"function-checklist": {
				search: /(.+)([\n]?)/g,
				replace: "* [ ] $1$2",
				forceNewline: true
			},

			"function-code": {
				exec: function(txt, selText, commentForm, next) {
					var rt = selText.indexOf("\n") > -1 ? "$1\n```\n$2\n```$3" : "$1`$2`$3";
					next(selText.replace(/^(\s*)([\s\S]*?)(\s*)$/g, rt));
				}
			},
			"function-blockquote": {
				search: /(.+)([\n]?)/g,
				replace: "> $1$2",
				forceNewline: true
			},
			"function-hr": {
				append: "\n***\n",
				forceNewline: true
			},
			"function-table": {
				append: "\n" +
						"| Head | Head | Head |\n" +
						"| :--- | :--: | ---: |\n" +
						"| Cell | Cell | Cell |\n" +
						"| Cell | Cell | Cell |\n",
				forceNewline: true
			},

			"function-clear": {
				exec: function(txt, selText, commentForm, next) {
					commentForm.value = "";
					next("");
				}
			},

			"function-snippets-useragent": {
				exec: function(txt, selText, commentForm, next) {
					next("`" + navigator.userAgent + "`");
				}
			},
			"function-snippets-contributing": {
				exec: function(txt, selText, commentForm, next) {
					next("Please, always consider reviewing the [guidelines for contributing](../blob/master/CONTRIBUTING.md) to this repository.");
				}
			}
		};
	})();

	var editorHTML = (function editorHTML() {
		return '<div id="gollum-editor-function-buttons" style="float: left;">' +
				'	<div class="button-group">' +
				'		<a href="#" id="function-bold" class="minibutton function-button tooltipped tooltipped-ne" aria-label="Bold" style="height:26px;">' +
				'			<b style="font-weight: bolder;">B</b>' +
				'		</a>' +
				'		<a href="#" id="function-italic" class="minibutton function-button tooltipped tooltipped-ne" aria-label="Italic">' +
				'			<em>i</em>' +
				'		</a>' +
				'		<a href="#" id="function-strikethrough" class="minibutton function-button tooltipped tooltipped-ne" aria-label="Strikethrough">' +
				'			<s>S</s>' +
				'		</a>' +
				'	</div>' +

				'	<div class="button-group">' +
				'		<div class="select-menu js-menu-container js-select-menu">' +
				'			<span class="minibutton select-menu-button icon-only js-menu-target" aria-label="Headers" style="padding:0 7px; width:auto; border-bottom-right-radius:3px; border-top-right-radius:3px;">' +
				'		<span class="js-select-button">h#</span>' +
				'			</span>' +
				'			<div class="select-menu-modal-holder js-menu-content js-navigation-container js-active-navigation-container" style="top: 26px;">' +
				'				<div class="select-menu-modal" style="width:auto; overflow:visible;">' +
				'					<div class="select-menu-header">' +
				'						<span class="select-menu-title">Choose header</span>' +
				'						<span class="octicon octicon-remove-close js-menu-close"></span>' +
				'					</div>' +
				'					<div class="button-group">' +
				'						<a href="#" id="function-h1" class="minibutton function-button js-navigation-item js-menu-close tooltipped tooltipped-s" aria-label="Header 1">' +
				'							<b class="select-menu-item-text js-select-button-text">h1</b>' +
				'						</a>' +
				'						<a href="#" id="function-h2" class="minibutton function-button js-navigation-item js-menu-close tooltipped tooltipped-s" aria-label="Header 2">' +
				'							<b class="select-menu-item-text js-select-button-text">h2</b>' +
				'						</a>' +
				'						<a href="#" id="function-h3" class="minibutton function-button js-navigation-item js-menu-close tooltipped tooltipped-s" aria-label="Header 3">' +
				'							<b class="select-menu-item-text js-select-button-text">h3</b>' +
				'						</a>' +
				'						<a href="#" id="function-h4" class="minibutton function-button js-navigation-item js-menu-close tooltipped tooltipped-s" aria-label="Header 4">' +
				'							<b class="select-menu-item-text js-select-button-text">h4</b>' +
				'						</a>' +
				'						<a href="#" id="function-h5" class="minibutton function-button js-navigation-item js-menu-close tooltipped tooltipped-s" aria-label="Header 5">' +
				'							<b class="select-menu-item-text js-select-button-text">h5</b>' +
				'						</a>' +
				'						<a href="#" id="function-h6" class="minibutton function-button js-navigation-item js-menu-close tooltipped tooltipped-s" aria-label="Header 6">' +
				'							<b class="select-menu-item-text js-select-button-text">h6</b>' +
				'						</a>' +
				'					</div>' +
				'				</div>' +
				'			</div>' +
				'		</div>' +
				'	</div>' +

				'	<div class="button-group">' +
				'		<a href="#" id="function-link" class="minibutton function-button tooltipped tooltipped-ne" aria-label="Link">' +
				'			<span class="octicon octicon-link"></span>' +
				'		</a>' +
				'		<a href="#" id="function-image" class="minibutton function-button tooltipped tooltipped-ne" aria-label="Image">' +
				'			<span class="octicon octicon-file-media"></span>' +
				'		</a>' +
				'	</div>' +
				'	<div class="button-group">' +
				'		<a href="#" id="function-ul" class="minibutton function-button tooltipped tooltipped-ne" aria-label="Unordered List">' +
				'			<span class="octicon octicon-list-unordered"></span>' +
				'		</a>' +
				'		<a href="#" id="function-ol" class="minibutton function-button tooltipped tooltipped-ne" aria-label="Ordered List">' +
				'			<span class="octicon octicon-list-ordered"></span>' +
				'		</a>' +
				'		<a href="#" id="function-checklist" class="minibutton function-button tooltipped tooltipped-ne" aria-label="Task List">' +
				'			<span class="octicon octicon-checklist"></span>' +
				'		</a>' +
				'	</div>' +

				'	<div class="button-group">' +
				'		<a href="#" id="function-code" class="minibutton function-button tooltipped tooltipped-ne" aria-label="Code">' +
				'			<span class="octicon octicon-code"></span>' +
				'		</a>' +
				'		<a href="#" id="function-blockquote" class="minibutton function-button tooltipped tooltipped-ne" aria-label="Blockquote">' +
				'			<span class="octicon octicon-quote"></span>' +
				'		</a>' +
				'		<a href="#" id="function-hr" class="minibutton function-button tooltipped tooltipped-ne" aria-label="Horizontal Rule">' +
				'			<span class="octicon octicon-horizontal-rule"></span>' +
				'		</a>' +
				'		<a href="#" id="function-table" class="minibutton function-button tooltipped tooltipped-ne" aria-label="Table">' +
				'			<span class="octicon octicon-three-bars"></span>' +
				'		</a>' +
				'	</div>' +

				'	<div class="button-group">' +
				'		<div class="select-menu js-menu-container js-select-menu">' +
				'			<span class="minibutton select-menu-button js-menu-target" aria-label="Snippets" style="padding:0 7px; width:auto; border-bottom-right-radius:3px; border-top-right-radius:3px;">' +
				'				<span class="octicon octicon-pin"></span>' +
				'			</span>' +
				'			<div class="select-menu-modal-holder js-menu-content js-navigation-container js-active-navigation-container">' +
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
				'						<div data-filterable-for="context-snippets-filter-field">' +
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

				'</div>' +

				'<div class="button-group" style="float:right;">' +
				'	<a href="#" id="function-clear" class="minibutton function-button tooltipped tooltipped-nw" aria-label="Clear">' +
				'		<span class="octicon octicon-circle-slash"></span>' +
				'	</a>' +
				'</div>';
	})();

	// Source: https://github.com/gollum/gollum/blob/9c714e768748db4560bc017cacef4afa0c751a63/lib/gollum/public/gollum/javascript/editor/gollum.editor.js#L516
	function executeAction(definitionObject, commentForm) {
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
			definitionObject.exec(txt, selText, commentForm, function(repText) {
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

	var functionButtonClick = function(e) {
		e.preventDefault();
		executeAction(MarkDown[this.id], this.commentForm);
		return false;
	};

	function addToolbar() {
		if (isWiki()) {
			// Override existing language with improved & missing functions and remove existing click events;
			overrideGollumMarkdown();
			unbindGollumFunctions();

			// Remove existing click events when changing languages;
			document.getElementById("wiki_format").addEventListener("change", function() {
				unbindGollumFunctions();

				Array.prototype.forEach.call(document.querySelectorAll(".comment-form-textarea .function-button"), function(button) {
					button.removeEventListener("click", functionButtonClick);
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
					var temp = document.createElement("div");
					temp.innerHTML = editorHTML;
					temp.firstElementChild.appendChild(document.getElementById("function-help"));  // restore the help button;
					gollumEditor.replaceChild(temp.querySelector("#gollum-editor-function-buttons"), document.getElementById("gollum-editor-function-buttons"));
					Array.prototype.forEach.call(temp.children, function(elm) {
						elm.style.position = "absolute";
						elm.style.right = "30px";
						elm.style.top = "0";
						commentForm.parentNode.insertBefore(elm, commentForm);
					});
					temp = null;
				} else {
					gollumEditor = document.createElement("div");
					gollumEditor.innerHTML = editorHTML;
					gollumEditor.id = "gollum-editor-function-bar";
					gollumEditor.style.height = "26px";
					gollumEditor.style.margin = "10px 0";
					gollumEditor.classList.add("active");
					commentForm.parentNode.insertBefore(gollumEditor, commentForm);
				}

				var tabnavExtras = commentForm.parentNode.parentNode.querySelector(".comment-form-head .tabnav-right");
				if (tabnavExtras) {
					var sponsored = document.createElement("a");
					sponsored.setAttribute("href", "https://github.com/jerone/UserScripts/tree/master/Github_Comment_Enhancer");
					sponsored.setAttribute("target", "_blank");
					sponsored.classList.add("tabnav-widget", "text", "tabnav-extras");
					var sponsoredIcon = document.createElement("span");
					sponsoredIcon.classList.add("octicon", "octicon-question");
					sponsored.appendChild(sponsoredIcon);
					sponsored.appendChild(document.createTextNode("Enhanced by Github Comment Enhancer"));
					tabnavExtras.insertBefore(sponsored, tabnavExtras.firstElementChild);
				}
			}

			if (isGist()) {
				Array.prototype.forEach.call(gollumEditor.parentNode.querySelectorAll(".select-menu-button"), function(button) {
					button.style.paddingRight = "25px";
				});
			}

			Array.prototype.forEach.call(gollumEditor.parentNode.querySelectorAll(".function-button"), function(button) {
				if (isGist() && button.classList.contains("minibutton")) {
					button.style.padding = "0px";
					button.style.textAlign = "center";
					button.style.width = "30px";
					button.firstElementChild.style.marginRight = "0px";
				}
				button.commentForm = commentForm;  // remove event listener doesn't accept `bind`;
				button.addEventListener("click", functionButtonClick);
			});
		});
	}

	// Source: https://github.com/domchristie/to-markdown
	var toMarkdown = function(string) {

		var ELEMENTS = [
			{
				patterns: 'p',
				replacement: function(str, attrs, innerHTML) {
					return innerHTML ? '\n\n' + innerHTML + '\n' : '';
				}
			},
			{
				patterns: 'br',
				type: 'void',
				replacement: '\n'
			},
			{
				patterns: 'h([1-6])',
				replacement: function(str, hLevel, attrs, innerHTML) {
					var hPrefix = '';
					for (var i = 0; i < hLevel; i++) {
						hPrefix += '#';
					}
					return '\n\n' + hPrefix + ' ' + innerHTML + '\n';
				}
			},
			{
				patterns: 'hr',
				type: 'void',
				replacement: '\n\n* * *\n'
			},
			{
				patterns: 'a',
				replacement: function(str, attrs, innerHTML) {
					var href = attrs.match(attrRegExp('href')),
						title = attrs.match(attrRegExp('title'));
					return href ? '[' + innerHTML + ']' + '(' + href[1] + (title && title[1] ? ' "' + title[1] + '"' : '') + ')' : str;
				}
			},
			{
				patterns: ['b', 'strong'],
				replacement: function(str, attrs, innerHTML) {
					return innerHTML ? '**' + innerHTML + '**' : '';
				}
			},
			{
				patterns: ['i', 'em'],
				replacement: function(str, attrs, innerHTML) {
					return innerHTML ? '_' + innerHTML + '_' : '';
				}
			},
			{
				patterns: 'code',
				replacement: function(str, attrs, innerHTML) {
					//return innerHTML ? '`' + he.decode(innerHTML) + '`' : '';
					return innerHTML ? '`' + innerHTML + '`' : '';
				}
			},
			{
				patterns: 'img',
				type: 'void',
				replacement: function(str, attrs/*, innerHTML*/) {
					var src = attrs.match(attrRegExp('src')),
						alt = attrs.match(attrRegExp('alt')),
						title = attrs.match(attrRegExp('title'));
					return '![' + (alt && alt[1] ? alt[1] : '') + ']' + '(' + src[1] + (title && title[1] ? ' "' + title[1] + '"' : '') + ')';
				}
			}
		];

		for (var i = 0, len = ELEMENTS.length; i < len; i++) {
			if (typeof ELEMENTS[i].patterns === 'string') {
				string = replaceEls(string, { tag: ELEMENTS[i].patterns, replacement: ELEMENTS[i].replacement, type: ELEMENTS[i].type });
			} else {
				for (var j = 0, pLen = ELEMENTS[i].patterns.length; j < pLen; j++) {
					string = replaceEls(string, { tag: ELEMENTS[i].patterns[j], replacement: ELEMENTS[i].replacement, type: ELEMENTS[i].type });
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

		string = string.replace(/<pre\b[^>]*>`([\s\S]*)`<\/pre>/gi, function(str, innerHTML) {
			//var text = he.decode(innerHTML);
			var text = innerHTML;
			text = text.replace(/^\t+/g, ' '); // convert tabs to spaces (you know it makes sense)
			text = text.replace(/\n/g, '\n ');
			return '\n\n ' + text + '\n';
		});

		// Lists

		// Escape numbers that could trigger an ol
		// If there are more than three spaces before the code, it would be in a pre tag
		// Make sure we are escaping the period not matching any character
		string = string.replace(/^(\s{0,3}\d+)\. /g, '$1\\. ');

		// Converts lists that have no child lists (of same type) first, then works its way up
		var noChildrenRegex = /<(ul|ol)\b[^>]*>(?:(?!<ul|<ol)[\s\S])*?<\/\1>/gi;
		var replaceListsFn = function(str) {
			return replaceLists(str);
		};
		while (string.match(noChildrenRegex)) {
			string = string.replace(noChildrenRegex, replaceListsFn);
		}

		function replaceLists(html) {

			html = html.replace(/<(ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi, function(str, listType, innerHTML) {
				var lis = innerHTML.split('</li>');
				lis.splice(lis.length - 1, 1);

				var lisReplace = function(str, innerHTML) {
					innerHTML = innerHTML.replace(/^\s+/, '');
					innerHTML = innerHTML.replace(/\n\n/g, '\n\n ');
					// indent nested lists
					innerHTML = innerHTML.replace(/\n([ ]*)+(\*|\d+\.) /g, '\n$1 $2 ');
					return prefix + innerHTML;
				};

				for (i = 0, len = lis.length; i < len; i++) {
					if (lis[i]) {
						var prefix = (listType === 'ol') ? (i + 1) + ". " : "* ";
						lis[i] = lis[i].replace(/\s*<li[^>]*>([\s\S]*)/i, lisReplace);
					}
				}
				return lis.join('\n');
			});
			return '\n\n' + html.replace(/[ \t]+\n|\s+$/g, '');
		}

		// Blockquotes
		var deepest = /<blockquote\b[^>]*>((?:(?!<blockquote)[\s\S])*?)<\/blockquote>/gi;
		var replaceBlockquotesFn = function(str) {
			return replaceBlockquotes(str);
		};
		while (string.match(deepest)) {
			string = string.replace(deepest, replaceBlockquotesFn);
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

	function addReplyButtons() {
		Array.prototype.forEach.call(document.querySelectorAll(".comment"), function(comment) {
			var oldReply = comment.querySelector(".GithubCommentEnhancerReply");
			if (oldReply) { oldReply.parentNode.removeChild(oldReply); }

			var header = comment.querySelector(".timeline-comment-header"),
				actions = comment.querySelector(".timeline-comment-actions"),
				newComment = document.querySelector(".timeline-new-comment .comment-form-textarea");

			if (!header) { return; }
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
				text += String.format('@{0} commented on [{1}]({2} "{3} - Replied by Github Comment Enhancer"):\n{4}\n\n',
					comment.querySelector(".author").textContent,
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
	unsafeWindow.$(document).on("pjax:end", init);  // `pjax:end` also runs on history back;

	// for inline comments;
	var files = document.querySelectorAll('.file-code');
	Array.prototype.forEach.call(files, function(file) {
		file = file.firstElementChild;
		new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.target === file) {
					addToolbar();
				}
			});
		}).observe(file, { childList: true, subtree: true });
	});

})(typeof unsafeWindow !== "undefined" ? unsafeWindow : window);
