// ==UserScript==
// @id          Github_Comment_Enhancer@https://github.com/jerone/UserScripts
// @name        Github Comment Enhancer
// @namespace   https://github.com/jerone/UserScripts
// @description Enhances Github comments
// @author      jerone
// @homepage    https://github.com/jerone/UserScripts/tree/master/Github_Comment_Enhancer
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Github_Comment_Enhancer
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Github_Comment_Enhancer/Github_Comment_Enhancer.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Github_Comment_Enhancer/Github_Comment_Enhancer.user.js
// @version     1.3
// @grant       none
// @run-at      document-end
// @include     https://github.com/*/*/issues/*
// @include     https://github.com/*/*/pull/*
// @include     https://github.com/*/*/commit/*
// @include     https://github.com/*/*/wiki/*
// @include     https://gist.github.com/*
// ==/UserScript==
/* global unsafeWindow */

(function() {

	// Source: https://github.com/gollum/gollum/blob/9c714e768748db4560bc017cacef4afa0c751a63/lib/gollum/public/gollum/javascript/editor/langs/markdown.js
	var MarkDown = {
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
			exec: function(txt, selText, next) {
				var isUrl = selText && /(?:https?:\/\/)|(?:www\.)/.test(selText.trim()),
					href = window.prompt("Link href:", isUrl ? selText.trim() : ""),
					text = window.prompt("Link text:", isUrl ? "" : selText.trim());
				if (href) {
					next("[" + (text || href) + "](" + href + ")");
				}
			}
		},
		"function-image": {
			exec: function(txt, selText, next) {
				var isUrl = selText && /(?:https?:\/\/)|(?:www\.)/.test(selText.trim()),
					href = window.prompt("Image href:", isUrl ? selText.trim() : ""),
					text = window.prompt("Image text:", isUrl ? "" : selText.trim());
				if (href) {
					next("![" + (text || href) + "](" + href + ")");
				}
			}
		},

		"function-ul": {
			search: /(.+)([\n]?)/g,
			replace: "* $1$2",
			forceNewline: true
		},
		"function-ol": {
			exec: function(txt, selText, next) {
				var repText = "";
				if (!selText) {
					repText = "1. ";
				} else {
					var lines = selText.split("\n"),
						hasContent = /[\w]+/;
					for (var i = 0; i < lines.length; i++) {
						if (hasContent.test(lines[i])) {
							repText += (i + 1).toString() + ". " + lines[i] + "\n";
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
			exec: function(txt, selText, next) {
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
					"| Header | Header | Header |\n" +
					"| :--- | :---: | ---: |\n" +
					"| Cell | Cell  | Cell |\n" +
					"| Cell | Cell  | Cell |\n",
			forceNewline: true
		}
	};

	var editorHTML = (function() {
		return '<div id="gollum-editor-function-buttons">' +
				'	<div class="button-group">' +
				'		<a href="#" id="function-bold" class="minibutton function-button" title="Bold" tabindex="-1">' +
				'			<b>B</b>' +
				'		</a>' +
				'		<a href="#" id="function-italic" class="minibutton function-button" title="Italic" tabindex="-1">' +
				'			<em>i</em>' +
				'		</a>' +
				'		<a href="#" id="function-strikethrough" class="minibutton function-button" title="Strikethrough" tabindex="-1">' +
				'			<s>S</s>' +
				'		</a>' +
				'	</div>' +

				'	<div class="button-group">' +
				'		<div class="select-menu js-menu-container js-select-menu js-composer-assignee-picker">' +
				'			<span aria-haspopup="true" title="Headers" role="button" class="minibutton select-menu-button icon-only js-menu-target" style="padding:0 18px 0 7px; width:auto; border-bottom-right-radius:3px; border-top-right-radius:3px;">' +
				'				<b>h#</b>' +
				'			</span>' +
				'			<div aria-hidden="false" class="select-menu-modal-holder js-menu-content js-navigation-container js-active-navigation-container" style="top: 26px;">' +
				'				<div class="select-menu-modal" style="width:auto;">' +
				'					<div class="select-menu-header">' +
				'						<span class="select-menu-title">Choose header</span>' +
				'						<span class="octicon octicon-remove-close js-menu-close"></span>' +
				'					</div>' +
				'					<div class="button-group">' +
				'						<a href="#" id="function-h1" class="minibutton function-button js-menu-close" title="Header 1" tabindex="-1">' +
				'							<b>h1</b>' +
				'						</a>' +
				'						<a href="#" id="function-h2" class="minibutton function-button js-menu-close" title="Header 2" tabindex="-1">' +
				'							<b>h2</b>' +
				'						</a>' +
				'						<a href="#" id="function-h3" class="minibutton function-button js-menu-close" title="Header 3" tabindex="-1">' +
				'							<b>h3</b>' +
				'						</a>' +
				'						<a href="#" id="function-h4" class="minibutton function-button js-menu-close" title="Header 4" tabindex="-1">' +
				'							<b>h4</b>' +
				'						</a>' +
				'						<a href="#" id="function-h5" class="minibutton function-button js-menu-close" title="Header 5" tabindex="-1">' +
				'							<b>h5</b>' +
				'						</a>' +
				'						<a href="#" id="function-h6" class="minibutton function-button js-menu-close" title="Header 6" tabindex="-1">' +
				'							<b>h6</b>' +
				'						</a>' +
				'					</div>' +
				'				</div>' +
				'			</div>' +
				'		</div>' +
				'	</div>' +

				'	<div class="button-group">' +
				'		<a href="#" id="function-link" class="minibutton function-button" title="Link" tabindex="-1">' +
				'			<span class="octicon octicon-link"></span>' +
				'		</a>' +
				'		<a href="#" id="function-image" class="minibutton function-button" title="Image" tabindex="-1">' +
				'			<span class="octicon octicon-file-media"></span>' +
				'		</a>' +
				'	</div>' +
				'	<div class="button-group">' +
				'		<a href="#" id="function-ul" class="minibutton function-button" title="Unordered List" tabindex="-1">' +
				'			<span class="octicon octicon-list-unordered"></span>' +
				'		</a>' +
				'		<a href="#" id="function-ol" class="minibutton function-button" title="Ordered List" tabindex="-1">' +
				'			<span class="octicon octicon-list-ordered"></span>' +
				'		</a>' +
				'		<a href="#" id="function-checklist" class="minibutton function-button" title="Task List" tabindex="-1">' +
				'			<span class="octicon octicon-checklist"></span>' +
				'		</a>' +
				'	</div>' +

				'	<div class="button-group">' +
				'		<a href="#" id="function-code" class="minibutton function-button" title="Code" tabindex="-1">' +
				'			<span class="octicon octicon-code"></span>' +
				'		</a>' +
				'		<a href="#" id="function-blockquote" class="minibutton function-button" title="Blockquote" tabindex="-1">' +
				'			<span class="octicon octicon-quote"></span>' +
				'		</a>' +
				'		<a href="#" id="function-hr" class="minibutton function-button" title="Horizontal Rule" tabindex="-1">' +
				'			<span class="octicon octicon-horizontal-rule"></span>' +
				'		</a>' +
				'		<a href="#" id="function-table" class="minibutton function-button" title="Table" tabindex="-1">' +
				'			<span class="octicon octicon-three-bars"></span>' +
				'		</a>' +
				'	</div>' +
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
			definitionObject.exec(txt, selText, function(repText) {
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

		// Gist Github requires that the comment form change event be triggered to update the preview;
		unsafeWindow.$(commentForm).trigger("change");

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

	var functionButtonClick = function(e) {
		e.preventDefault();
		executeAction(MarkDown[this.id], this.commentForm);
		return false;
	};

	function addToolbar() {
		if (isWiki()) {
			// Override existing language with improved & missing functions and remove existing click events;
			unsafeWindow.$.GollumEditor.defineLanguage("markdown", MarkDown);
			unsafeWindow.$(".function-button:not(#function-help)").unbind("click");

			// Remove existing click events when changing languages;
			document.getElementById("wiki_format").addEventListener("change", function() {
				unsafeWindow.$(".function-button:not(#function-help)").unbind("click");

				Array.forEach(document.querySelectorAll(".comment-form-textarea .function-button"), function(button) {
					button.removeEventListener("click", functionButtonClick);
				});
			});
		}

		Array.forEach(document.querySelectorAll(".comment-form-textarea,.js-comment-field"), function(commentForm) {
			if (commentForm.classList.contains("GithubCommentEnhancer")) { return; }
			commentForm.classList.add("GithubCommentEnhancer");

			var gollumEditor;
			if (isWiki()) {
				gollumEditor = document.getElementById("gollum-editor-function-bar");
				var temp = document.createElement("div");
				temp.innerHTML = editorHTML;
				temp.firstChild.appendChild(document.getElementById("function-help"));  // restore the help button;
				gollumEditor.replaceChild(temp.firstChild, document.getElementById("gollum-editor-function-buttons"));
			} else {
				gollumEditor = document.createElement("div");
				gollumEditor.innerHTML = editorHTML;
				gollumEditor.id = "gollum-editor-function-bar";
				gollumEditor.style.border = "0 none";
				gollumEditor.style.paddingBottom = "10px";
				gollumEditor.classList.add("active");
				commentForm.parentNode.insertBefore(gollumEditor, commentForm.parentNode.firstChild);
			}

			Array.forEach(gollumEditor.querySelectorAll(".function-button"), function(button) {
				button.style.width = "30px";
				button.style.textAlign = "center";
				button.style.padding = "0px";
				button.firstElementChild.style.marginRight = "0px";
				button.commentForm = commentForm;  // remove event listener doesn't accept `bind`;
				button.addEventListener("click", functionButtonClick);
			});
		});
	}

	// init;
	addToolbar();

	// on pjax;
	unsafeWindow.$(document).on("pjax:success", addToolbar);

	// on page update;
	unsafeWindow.$.pageUpdate(function() {
		window.setTimeout(function() {
			addToolbar();
		}, 1);
	});

})();