// ==UserScript==
// @id          Github_Image_Viewer@https://github.com/jerone/UserScripts
// @name        Github Image Viewer
// @namespace   https://github.com/jerone/UserScripts
// @description Preview images from within the listing.
// @author      jerone
// @copyright   2014+, jerone (https://github.com/jerone)
// @license     CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license     GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @homepage    https://github.com/jerone/UserScripts/tree/master/Github_Image_Viewer
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Github_Image_Viewer
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Github_Image_Viewer/Github_Image_Viewer.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Github_Image_Viewer/Github_Image_Viewer.user.js
// @supportURL  https://github.com/jerone/UserScripts/issues
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @version     0.5.0
// @icon        https://github.githubassets.com/pinned-octocat.svg
// @grant       none
// @run-at      document-end
// @include     https://github.com/*
// ==/UserScript==

(function() {

	String.format = function(string) {
		var args = Array.prototype.slice.call(arguments, 1, arguments.length);
		return string.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] !== "undefined" ? args[number] : match;
		});
	};

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

	var GithubImageViewer = {
		_floater: null,
		_floaterTitle: null,
		_floaterImage: null,
		_floaterMeta: null,

		_imageUrl: null,
		_loaderSrc: "https://github.githubassets.com/images/spinners/octocat-spinner-32.gif",
		_imageRegex: /.+(\.jpe?g|\.png|\.gif|\.bmp|\.ico|\.tiff?)$/i,

		Initialize: function() {
			var floater = GithubImageViewer._floater = document.createElement("div");
			floater.style.position = "absolute";
			floater.style.top = "0";
			floater.style.left = "0";
			floater.style.zIndex = "999";
			document.body.appendChild(floater);

			var floaterMouseAlign = document.createElement("div");
			floaterMouseAlign.style.position = "absolute";
			floaterMouseAlign.style.bottom = "5px";
			floaterMouseAlign.style.left = "5px";
			floaterMouseAlign.style.border = "1px solid #b7c7cf";
			floaterMouseAlign.style.borderRadius = "3px";
			floaterMouseAlign.style.fontSize = "11px";
			floater.appendChild(floaterMouseAlign);

			var floaterTitle = GithubImageViewer._floaterTitle = document.createElement("div");
			floaterTitle.style.backgroundColor = "#e6f1f6";
      		floaterTitle.style.color = "black";
			floaterTitle.style.textAlign = "center";
			floaterTitle.style.borderBottom = "1px solid #d8e6ec";
			floaterTitle.style.padding = "3px 5px";
			floaterMouseAlign.appendChild(floaterTitle);

			var floaterCenter = document.createElement("div");
			floaterCenter.style.minWidth = "40px";
			floaterCenter.style.minHeight = "40px";
			floaterCenter.style.display = "flex";
			floaterCenter.style.flexDirection = "column";
			floaterCenter.style.backgroundColor = "#f8f8f8";
			floaterCenter.style.padding = "3px";
			floaterMouseAlign.appendChild(floaterCenter);

			var floaterImage = GithubImageViewer._floaterImage = document.createElement("img");
			floaterImage.setAttribute("src", GithubImageViewer._loaderSrc);
			floaterImage.style.margin = "auto";
			floaterImage.style.maxWidth = floaterImage.style.maxHeight = "200px";
			floaterCenter.appendChild(floaterImage);

			var floaterMeta = GithubImageViewer._floaterMeta = document.createElement("div");
			floaterMeta.style.backgroundColor = "#f8f8f8";
      		floaterMeta.style.color = "black";
			floaterMeta.style.padding = "3px";
			floaterMeta.style.textAlign = "center";
			floaterMeta.style.whiteSpace = "nowrap";
			floaterMouseAlign.appendChild(floaterMeta);
			GithubImageViewer.SetMeta();

			GithubImageViewer.Attach();
		},

		Attach: function() {
			document.getElementById("js-repo-pjax-container").addEventListener("mousemove", function(e) {
				var target = e.target;
				if (target.classList && target.classList.contains("js-navigation-open") &&
					GithubImageViewer._imageRegex.test(target.href)) {

					if (target.getAttribute("title")) {
						target.dataset.title = target.getAttribute("title");
						target.removeAttribute("title");
					}

					if (GithubImageViewer._visible) {
						GithubImageViewer.Show(e.pageX, e.pageY);
					} else {
						GithubImageViewer.AddTimer(proxy(function() {
							GithubImageViewer.ClearTimers();

							GithubImageViewer.Show(e.pageX, e.pageY);

							var href = target.href;
							if (GithubImageViewer._imageUrl !== href) {
								GithubImageViewer._imageUrl = href;
								GithubImageViewer.SetImage(GithubImageViewer._imageUrl);

								GithubImageViewer.SetTitle(target.dataset.title);
							}
						}));
					}
				} else {
					GithubImageViewer.Dispose();
				}
			});
			document.body.addEventListener("click", function() {
				GithubImageViewer.Dispose();
			});
			document.body.addEventListener("contextmenu", function() {
				GithubImageViewer.Dispose();
			});
			document.body.addEventListener("keydown", function(e) {
				if (e.keyCode === 27) {
					GithubImageViewer.Dispose();
				}
			});
		},

		_visible: false,
		Show: function(x, y) {
			GithubImageViewer._visible = true;
			GithubImageViewer._floater.style.left = x + "px";
			GithubImageViewer._floater.style.top = y + "px";
		},
		Hide: function() {
			GithubImageViewer._visible = false;
			GithubImageViewer._floater.style.left = "-1000px";
			GithubImageViewer._floater.style.top = "-1000px";
		},

		Dispose: function() {
			GithubImageViewer.ClearTimers();

			GithubImageViewer.Hide();

			GithubImageViewer._imageUrl = GithubImageViewer._loaderSrc;
			GithubImageViewer.SetImage(GithubImageViewer._imageUrl);

			GithubImageViewer.SetTitle("Loading...");
		},

		_timers: [],
		_timeout: 700,
		AddTimer: function(fn) {
			GithubImageViewer._timers.push(window.setTimeout(fn, GithubImageViewer._timeout));
		},
		ClearTimers: function() {
			Array.prototype.forEach.call(GithubImageViewer._timers, function(timer) {
				window.clearTimeout(timer);
			});
		},

		SetTitle: function(text) {
			GithubImageViewer._floaterTitle.textContent = text;
		},

		SetImage: function(src) {
			src = src.replace("/blob/", "/raw/");
			if (src !== GithubImageViewer._loaderSrc) {
				var temp = document.createElement("img");
				temp.style.visibility = "hidden";
				temp.addEventListener("load", function() {
					GithubImageViewer.SetMeta(this.width, this.height);
					this.parentNode.removeChild(temp);
				});
				temp.setAttribute("src", src);
				document.body.appendChild(temp);
			} else {
				GithubImageViewer.SetMeta();
			}

			GithubImageViewer._floaterImage.setAttribute("src", src);
		},

		SetMeta: function(w, h) {
			if (!w && !h) {
				GithubImageViewer._floaterMeta.style.display = "none";
			} else {
				GithubImageViewer._floaterMeta.style.display = "block";
				GithubImageViewer._floaterMeta.innerHTML = String.format("<strong>W:</strong> {0}px | <strong>H:</strong> {1}px", w, h);
			}
		}
	};

	if (document.getElementById("js-repo-pjax-container")) {
		GithubImageViewer.Initialize();
	}

})();
