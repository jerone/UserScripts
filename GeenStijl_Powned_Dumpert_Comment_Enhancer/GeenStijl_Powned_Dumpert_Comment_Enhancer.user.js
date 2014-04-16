// ==UserScript==
// @name        GeenStijl & Powned & Dumpert Comment Enhancer
// @namespace   https://github.com/jerone/UserScripts
// @description Add features to enhance comments on GeenStijl & Powned & Dumpert & more.
// @author      jerone
// @homepage    https://github.com/jerone/UserScripts/tree/master/GeenStijl_Powned_Dumpert_Comment_Enhancer
// @homepageURL https://github.com/jerone/UserScripts/tree/master/GeenStijl_Powned_Dumpert_Comment_Enhancer
// @downloadURL https://github.com/jerone/UserScripts/raw/master/GeenStijl_Powned_Dumpert_Comment_Enhancer/GeenStijl_Powned_Dumpert_Comment_Enhancer.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/GeenStijl_Powned_Dumpert_Comment_Enhancer/GeenStijl_Powned_Dumpert_Comment_Enhancer.user.js
// @include     http*://*geenstijl.nl/mt/archieven/*
// @include     http*://*geenstijl.tv/*
// @include     http*://*powned.tv/nieuws/*
// @include     http*://*dumpert.nl/mediabase/*
// @include     http*://*daskapital.nl/*
// @include     http*://*glamora.ma/*
// @version     2.0
// @grant       none
// ==/UserScript==

(function() {

	function proxy(fn) {
		return function() {
			var that = this;
			return function(e) {
				var args = that.slice(0);  // clone;
				args.unshift(e);  // prepend event;
				fn.apply(this, args);
			};
		}.call([].slice.call(arguments, 1));
	}

	function wait(condition, next) {
		var loop = window.setInterval(function() {
			if (condition() === true) {
				window.clearInterval(loop);
				next();
			}
		}, 100);
	}

	String.format = function(string) {
		var args = Array.prototype.slice.call(arguments, 1, arguments.length);
		return string.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] !== "undefined" ? args[number] : match;
		});
	};

	var replyImgScr = "data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABcSURBVChTjZBbDsAgCATl2PDFzW236RjqI+kmSsBxQS0i+q2GzKzVfBy8oOCj3L03bRIROjNHbQGBgRQx+TgC6ALQEawtGeNpzWNwETjD2xlVrGtp/et7ZpddfgEnfhsfVr//KQAAAABJRU5ErkJgggA=";
	var permaImgScr = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAABGdBTUEAAK/INwWK6QAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABZ0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMDvo9WkAAABfSURBVChTXY9BEsAgCAP7bMqpL4euDaJ2D0xMzKDXvWFmpSYjzsyIYP4YMQ2y7+rRrlhKh2ci091XDH1DJnPtlgsIetpYsTImmoxHVLuVMsHxaDf7D+tpQr/CAjnu/gJVo8cY6M1GEAAAAABJRU5ErkJggg==";

	var commentsList = document.getElementById("comments");
	if (commentsList) {
		wait(function() {
			return commentsList.querySelectorAll("article .nsb,.comment .nsb").length > 0;
		}, function() {
			Array.forEach(commentsList.querySelectorAll("article,.comment"), function(comment) {
				var footer = comment.querySelector("footer,.footer");

				if (comment.id) {
					var perma = document.createElement("a");
					perma.classList.add("nsb");
					perma.setAttribute("href", String.format("#{0}", comment.id));
					perma.setAttribute("title", String.format("Permalink #{0}", comment.id));
					perma.style.backgroundImage = String.format("url('{0}')", permaImgScr);
					perma.style.backgroundPosition = "center center";
					perma.style.marginRight = "4px";
					if (/https?:\/\/www\.powned\.tv\/nieuws\/.*/.test(location.href)) {  // add missing css;
						perma.style.cursor = "pointer";
						perma.style.cssFloat = "right";
						perma.style.height = perma.style.width = "10px";
					}
					footer.appendChild(perma);
				}

				var textArea = document.getElementById("text");
				if (textArea) {
					var reply = document.createElement("span");
					reply.classList.add("nsb");
					reply.setAttribute("title", "Beantwoorden");
					reply.style.backgroundImage = String.format("url('{0}')", replyImgScr);
					reply.style.backgroundPosition = "center center";
					reply.style.marginRight = "4px";
					if (/https?:\/\/www\.powned\.tv\/nieuws\/.*/.test(location.href)) {  // add missing css;
						reply.style.cursor = "pointer";
						reply.style.cssFloat = "right";
						reply.style.height = reply.style.width = "10px";
					}
					reply.addEventListener("click", proxy(function() {
						textArea.value += String.format("@{0}\n", Array.map(this.childNodes, function(node) {
							return (node.nodeType === 3) ? node.textContent.trim() : "";
						}).join(" ").trim().replace(/\s{2,}/, " ").replace(/\s?\|\s?$/g, ""));
						textArea.focus();
						textArea.scrollIntoView();
					}).bind(footer));
					footer.appendChild(reply);
				}
			});
		});
	}

})();
