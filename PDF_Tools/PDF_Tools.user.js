// ==UserScript==
// @id             PDF_Tools@https://github.com/jerone/UserScripts
// @name           PDF Tools
// @version        1.0
// @namespace      https://github.com/jerone/UserScripts
// @author         jerone
// @description
// @include        *.pdf
// @include        *.pdf?*
// @include        *.pdf#*
// @run-at         document-end
// ==/UserScript==

(function() {

	//console.log(PDFJS.version);  // "1.0.277"

	var mimetype = "png";

	var SecondaryToolbar = {
		opened: false,
		initialize: function secondaryToolbarInitialize() {
			this.toolbar = document.createElement("div");
			this.toolbar.classList.add("secondaryToolbar", "doorHangerRight", "hidden");
			this.toolbar.style.right = "180px";
			document.getElementById("mainContainer").appendChild(this.toolbar);

			this.buttonContainer = document.createElement("div");
			this.buttonContainer.classList.add("secondaryToolbarButtonContainer");
			this.toolbar.appendChild(this.buttonContainer);

			this.attachEvents();
		},

		attachEvents: function() {
			/// https://github.com/mozilla/pdf.js/blob/2f5c6d6c3a75f9f44826c776dd356e2f786f35de/web/viewer.js#L2248
			window.addEventListener("click", function click(evt) {
				if (SecondaryToolbar.opened && unsafeWindow.PDFView.container.contains(evt.target)) {
					SecondaryToolbar.close();
				}
			}, false);
			/// https://github.com/mozilla/pdf.js/blob/2f5c6d6c3a75f9f44826c776dd356e2f786f35de/web/viewer.js#L2381
			window.addEventListener("keydown", function keydown(evt) {
				if (SecondaryToolbar.opened && evt.keyCode === 27) {  // esc;
					SecondaryToolbar.close();
				}
			});
		},

		render: function() {
			console.log(unsafeWindow.PDFView.pages);
			console.log(unsafeWindow.PDFView.pages[0].draw);

			var pages = unsafeWindow.PDFView.pages;

			for (var i = 0, ii = pages.length; i < ii; i++) {
				var page = pages[i];
				console.log(page, page.draw);
				var img = document.createElement("a");
				img.classList.add("secondaryToolbarButton", "download");
				img.dataset.pageIndex = i;
				img.setAttribute("download", "page" + page.id + "." + mimetype);
				img.setAttribute("title", "Download 'page" + page.id + "." + mimetype + "'");
				img.style.display = "inline-block";
				img.style.boxSizing = "border-box";
				img.appendChild(document.createTextNode("Page " + page.id));
				img.addEventListener("click", function() {
					var page = pages[this.dataset.pageIndex];
					if (!page.canvas) { page.draw(); }
					this.href = page.canvas.toDataURL("image/" + mimetype);
					//window.open( page.canvas.toDataURL("image/" + mimetype));
				});
				//this.buttonContainer.appendChild(img);

				console.log(page.canvas, img, arguments);

				//if (!page.canvas) { page.draw(); }
				var img2 = document.createElement("img");
				//img2.style.width = "16px";
				img2.style.height = "16px";
				img2.style.border = "1px solid red";
				//img2.src = page.canvas.toDataURL("image/" + mimetype);
				img2.src = page.canvas && page.canvas.toDataURL("image/" + mimetype) || "";
				this.buttonContainer.appendChild(img2);

			}

			/*
		unsafeWindow.PDFView.pages.forEach(function(page) {
			console.log(page, page.draw);
			if (page.draw) page.draw();

			var img = document.createElement("button");
			img.classList.add("secondaryToolbarButton", "download");
			img.dataset.canvasURL = page.canvas.toDataURL("image/" + mimetype);
			img.setAttribute("download", page.canvas.id + "." + mimetype);
			img.setAttribute("title", "Download " + page.canvas.id + "." + mimetype);
			img.style.display = "inline-block";
			img.appendChild(document.createTextNode(page.canvas.id));
			img.addEventListener("click", function() {
				this.href = this.dataset.canvasURL;
			});
			this.buttonContainer.appendChild(img);
			console.log(page.canvas, img, arguments);
		});
/*
		var canvases = document.querySelectorAll("canvas:not(.thumbnailImage)");
		console.log("test", canvases);
		Array.prototype.forEach.call(canvases, function(canvas) {
			var img = document.createElement("button");
			img.classList.add("secondaryToolbarButton", "download");
			img.dataset.canvasURL = canvas.toDataURL("image/" + mimetype);
			img.setAttribute("download", canvas.id + "." + mimetype);
			img.setAttribute("title", "Download " + canvas.id + "." + mimetype);
			img.style.display = "inline-block";
			img.appendChild(document.createTextNode(canvas.id));
			img.addEventListener("click", function() {
				this.href = this.dataset.canvasURL;
			});
			this.buttonContainer.appendChild(img);
			console.log(canvas, img, arguments);
		});*/
		},

		empty: function() {
			while (this.buttonContainer.hasChildNodes()) {
				this.buttonContainer.removeChild(this.buttonContainer.lastChild);
			}
		},

		open: function secondaryToolbarOpen() {
			if (this.opened) {
				return;
			}
			this.opened = true;
			this.toolbar.classList.remove('hidden');
			this.render();
		},

		close: function secondaryToolbarClose(target) {
			if (!this.opened) {
				return;
			} else if (target && !this.toolbar.contains(target)) {
				return;
			}
			this.opened = false;
			this.toolbar.classList.add('hidden');
			this.empty();
		},

		toggle: function secondaryToolbarToggle() {
			if (this.opened) {
				this.close();
			} else {
				this.open();
			}
		}
	};

	SecondaryToolbar.initialize();

	var toolbar = document.getElementById("toolbarViewerRight");
	var btn = document.createElement("button");
	btn.classList.add("toolbarButton", "zoomIn");
	toolbar.insertBefore(btn, toolbar.firstChild);
	btn.addEventListener("click", function() {
		SecondaryToolbar.toggle();
	});

})();
