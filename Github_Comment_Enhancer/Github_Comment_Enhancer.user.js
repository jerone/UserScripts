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
// @version     1.0
// @grant       none
// @run-at      document-end
// @include     https://github.com/*/*/issues/*
// @include     https://github.com/*/*/pull/*
// @include     https://github.com/*/*/commit/*
// ==/UserScript==

(function() {

	// Source: https://github.com/gollum/gollum/blob/9c714e768748db4560bc017cacef4afa0c751a63/lib/gollum/public/gollum/javascript/editor/langs/markdown.js
	var MarkDown = {
		"function-bold": {
			search: /([^\n]+)([\n\s]*)/g,
			replace: "**$1**$2"
		},
		"function-italic": {
			search: /([^\n]+)([\n\s]*)/g,
			replace: "_$1_$2"
		},
		"function-strikethrough": {
			search: /([^\n]+)([\n\s]*)/g,
			replace: "~~$1~~$2"
		},
		"function-code": {
			search: /([^\n]+)([\n\s]*)/g,
			replace: "`$1`$2"
		},
		"function-hr": {
			append: "\n***\n"
		},
		"function-ul": {
			search: /(.+)([\n]?)/g,
			replace: "* $1$2"
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
		"function-blockquote": {
			search: /(.+)([\n]?)/g,
			replace: "> $1$2"
		},
		"function-h1": {
			search: /(.+)([\n]?)/g,
			replace: "# $1$2"
		},
		"function-h2": {
			search: /(.+)([\n]?)/g,
			replace: "## $1$2"
		},
		"function-h3": {
			search: /(.+)([\n]?)/g,
			replace: "### $1$2"
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
		}
	};

	Array.forEach(document.querySelectorAll(".comment-form-textarea"), function(commentForm) {
		var gollumEditor = document.createElement("div");
		gollumEditor.innerHTML =
			'<div class="active" id="gollum-editor-function-bar">' +
			'  <div id="gollum-editor-function-buttons">' +
			'    <div class="button-group">' +
			'      <a href="#" id="function-h1" class="minibutton function-button" title="Header 1" tabindex="-1">' +
			'        <b>h1</b>' +
			'      </a>' +
			'      <a href="#" id="function-h2" class="minibutton function-button" title="Header 2" tabindex="-1">' +
			'        <b>h2</b>' +
			'      </a>' +
			'      <a href="#" id="function-h3" class="minibutton function-button" title="Header 3" tabindex="-1">' +
			'        <b>h3</b>' +
			'      </a>' +
			'    </div>' +
			'    <div class="button-group">' +
			'      <a href="#" id="function-link" class="minibutton function-button" title="Link" tabindex="-1">' +
			'        <span class="octicon octicon-link"></span>' +
			'      </a>' +
			'      <a href="#" id="function-image" class="minibutton function-button" title="Image" tabindex="-1">' +
			'        <span class="octicon octicon-file-media"></span>' +
			'      </a>' +
			'    </div>' +
			'    <div class="button-group">' +
			'      <a href="#" id="function-bold" class="minibutton function-button" title="Bold" tabindex="-1">' +
			'        <b>B</b>' +
			'      </a>' +
			'      <a href="#" id="function-italic" class="minibutton function-button" title="Italic" tabindex="-1">' +
			'        <em>i</em>' +
			'      </a>' +
			'      <a href="#" id="function-strikethrough" class="minibutton function-button" title="Strikethrough" tabindex="-1">' +
			'        <s>S</s>' +
			'      </a>' +
			'      <a href="#" id="function-code" class="minibutton function-button" title="Code" tabindex="-1">' +
			'        <span class="octicon octicon-code"></span>' +
			'      </a>' +
			'    </div>' +
			'    <div class="button-group">' +
			'      <a href="#" id="function-ul" class="minibutton function-button" title="Unordered List" tabindex="-1">' +
			'        <span class="octicon octicon-list-unordered"></span>' +
			'      </a>' +
			'      <a href="#" id="function-ol" class="minibutton function-button" title="Ordered List" tabindex="-1">' +
			'        <span class="octicon octicon-list-ordered"></span>' +
			'      </a>' +
			'      <a href="#" id="function-blockquote" class="minibutton function-button" title="Blockquote" tabindex="-1">' +
			'        <span class="octicon octicon-quote"></span>' +
			'      </a>' +
			'      <a href="#" id="function-hr" class="minibutton function-button" title="Horizontal Rule" tabindex="-1">' +
			'        <span class="octicon octicon-horizontal-rule"></span>' +
			'      </a>' +
			'    </div>' +
			//'    <a href="#" id="function-help" class="minibutton function-button" title="Help" tabindex="-1">' +
			//'	   <span class="octicon octicon-question"></span>' +
			//'    </a>' +
			'  </div>' +
			'</div>';
		commentForm.parentNode.insertBefore(gollumEditor, commentForm.parentNode.firstChild);

		Array.forEach(gollumEditor.querySelectorAll(".function-button"), function(button) {
			button.addEventListener("click", function(e) {
				e.preventDefault();

				executeAction(MarkDown[this.id], commentForm);

				return false;
			});
		});

	});

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

		// execute a replacement function if one exists
		if (definitionObject.exec && typeof definitionObject.exec === "function") {
			definitionObject.exec(txt, selText, function(repText) {
				replaceFieldSelection(commentForm, repText);
			});
			return;
		}

		// execute a search/replace if they exist
		var searchExp = /([^\n]+)/gi;
		if (definitionObject.search && typeof definitionObject.search === "object") {
			searchExp = null;
			searchExp = new RegExp(definitionObject.search);
		}

		// replace text
		if (definitionObject.replace && typeof definitionObject.replace === "string") {
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

		// append if necessary
		if (definitionObject.append && typeof definitionObject.append === "string") {
			if (repText === selText) {
				reselect = false;
			}
			repText += definitionObject.append;
		}

		if (repText) {
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

})();