// ==UserScript==
// @id          Multiple_Windows_Live_IDs@https://github.com/jerone/UserScripts
// @name        Multiple Windows Live IDs
// @namespace   https://github.com/jerone/UserScripts
// @description Easy login with multiple Microsoft accounts.
// @author      jerone
// @copyright   2014+, jerone (http://jeroenvanwarmerdam.nl)
// @license     GNU GPLv3
// @homepage    https://github.com/jerone/UserScripts/tree/master/Multiple_Windows_Live_IDs
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Multiple_Windows_Live_IDs
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Multiple_Windows_Live_IDs/Multiple_Windows_Live_IDs.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Multiple_Windows_Live_IDs/Multiple_Windows_Live_IDs.user.js
// @supportURL  https://github.com/jerone/UserScripts/issues
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @version     0.2.0
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-end
// @include     http*://login.live.com*
// ==/UserScript==
/* global GM_getValue,GM_setValue */

(function() {

	var autoLogin = true;
	var addPassMask = true;

	window.setTimeout(function() {

		var profileString = GM_getValue("MWLID.profiles"),
			profiles = [
				{ name: "Account 1", mail: "test1@live.com", pass: "P@ssw0rd" },
				{ name: "Account 2", mail: "test2@live.com", pass: "P@ssw0rd", photo: "data:image/gif;base64,abcd" },
				{ name: "Account 3", mail: "test3@live.com", pass: "P@ssw0rd", photo: "http://my.pictu.re/img.png" },
				{ name: "Account 4", mail: "test4@live.com", pass: "P@ssw0rd", color: "#EB008B" }
			];
		if (profileString == null) {
			GM_setValue("MWLID.profiles", JSON.stringify(profiles));
		} else {
			profiles = JSON.parse(profileString);
		}

		var image = {
			photoLight: "data:image/png;base64,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",
			photoDark: "data:image/png;base64,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",

			leftLight: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFSSURBVDhPfdK7SkNBEIDhKIJNVPBSWym2NlaWBgQRrcTGF7AxD2Bh6UPYGQQra9Eq1t7A0iKFiJBOUGJ1/P+wE85Z5QQ+2J2zO9mdnUZRFLkm2uiijwF66KCFyvrKBJv4wD0OsYYVbOAUn7jGAv4k2MM3jjGRYrlF3OIVwyTxYRluPkjzOmMwiScZJbjEVRqHWZzjBG4qf/MkXqflZBo/WEIsmMMDHtM44mXWpOPAylrl+OCGJ7xhB+uZSGhhew68910KjuMGdb9duNbXGTjwX55TUNvwSu84+8cqXOcT9x34AjbLFCLJVopZwIjl7JNuTF5wlMahLol9YrO1I7CPL5RfQjOYR/6MNpsd24yACy5gLfIkOYtu09n2lVaehEk8idcp10QmttncbNsP4+UF8iRex5p4f0/kE9snvowda9FHe8qbcy70iT2yzWbHZmuKxi8dFEek8XPCwwAAAABJRU5ErkJggg==",
			leftDark: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFCSURBVDhPjZI7LwVRFEaHSDQeiUetIrfVqJQkEhEq0fgDGn6A4pZ+hI5IVGqhovZKlAqFiEQnIVSste/cydzjmFjJSs5M5uw5Z++vyDCEO3iBr/iJj3iIi9jIEr7gFW7hHLZwAffwDU9xEn+xjh+4iwO+yDCF5/iAPUVm0M2b8dRMH1rEk1Qc40lnWTGGB9hGN9XxJF4nejKCXzjtQ8k4XuNNuc5hT2xsVLHLXdxwi0+4ivOJ3YI2NvZ570sX0I9n+N3gGorTccTxlzsXJSvolZ5xP+MsiiM2JzEBKw37ULKMvrOBf2FODFtwj9udZUVTEXNi2ExssIHvWJ+EjOIEpmM0bCbW2Ad+cIT2Ii2SYtMNnbHvYRAt4km8Tr0nYmHD5mZjn8WTeB174v09kSN23k7GxNr0f+GHjtgjGzYTm1AUP1toSncrMULNAAAAAElFTkSuQmCC",

			rightLight: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFVSURBVDhPfdKrSkRRFIDhUQSLjuAlmxysFpPRAUFkTGKZF7DoAxiMPoRNEUxm0aTZGxgNBhHBJiiajv9/2FvW7BnmwAd7r7PvazWqqiq1cYIX/OAD19jDBHrGx84cLvCJQ6xiEcvYwS3esYa+BZz8jCvMp1hpDPv4xlaK/S/gzk4eSf1hunCRln0D3tljlzu72AGOMZ1i2TnObNvxwbxzHJDN4B53qZ3jC/hF046v7YPlCSuFDl7xgLiI89o2TJWvbXsTw75LjMKxN+jaMM+myvYSjgZ4g0fegOP0iI4Ni8Q85x8lH9JTrofYZIq17FhhFol5zgOyQZO1iyfbdixPK8wiiYNM4yymQkxm4Avb9nPQ8rQ4LJI4uORk736KuujiT8vTRSwSB8Z/3tlju7OTx1H/i4NkeVphvrh5NlXu6Dt4Z4/dU+5xctSEJe6VOqjrvl/V+AN53EekRyYdxwAAAABJRU5ErkJggg==",
			rightDark: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFFSURBVDhPjZI7L0RRFEYvkWg8Eo9aRbQalZJEIjIq0fgDmvEDFEo/QkckKrVQUXslyikUIhKdhFCx1j4zXHfO3FjJSu45uee191dkWMJDfMAPfMEL3MYh7MkknuIr7uEizuI8buEVPuMyduHiFp7jlBMZBnAH33HdiTKe7OK+GNWziW4yEyPwzV67erKb7eIBjjlR4gSP02cqmG/OMY43eN3+7jCNnzjiwGpbMPGnhYoNfMRbLG/iOm8frbLasoZfNZ5hP8olWo/os62SOdzP+IReeRU73KG3i5DY515YSG+5EqPEMDoXnTBhhsQ+V8ktlibep88UTxNmSMrYxgkcjdEvduANN2LUxngajihKDS727UfYFTrj6SaGxB/L+Gav7ckuHsQsFsWEWXH7bKs80Tr4Zq/9n7hHwgyJT7JVP7n/S1F8A7gwSnemTnsFAAAAAElFTkSuQmCC",

			editLight: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAKxJREFUOE+tjbENQjEMBSPRgIRAomQFWIIp6FiJigUYgI6eipIZWIEJwjm2QYp+fizESdc4772kCDnnGd7wgWs7x6AwxQXeUYiPEJyj/HzGFcZHCHjZiY/wUJedeuRqlS8cW2XHRy64tZrCoVd2jjixmsIhWn7izz//uSxw3JXncYbLAg8b3EuqQbssaCYfcGhkvCxorlCP9MuCZj/4SKwsEHyhc7Lbsjx2SekNzHko02Qtti8AAAAASUVORK5CYII=",
			editDark: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAKtJREFUOE+lzU0OwWAUheEmJiRCYmgLugmrMLMlIxuwADNzI0NrsAUr+LxHeqS9/eiPmzyS0vcoUkqduBmuuGPd+K3+kMNNscAN+qIx0grquDn0zyes0BrJhsI51oNkR/rGFkcuQ2LzyBnl0NgOmLybEfED5af7J67a8bEHtogvR9nYAxvsECP7GotOn3vkRn7GovPLcaQzFp0D8UivWHRPeOBYfbmML+al4gWQp6tCc9RDvgAAAABJRU5ErkJggg==",

			deleteLight: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAJdJREFUOE+lk9sRwyAMBOkvqScFpAc3kB5cSQoia+vO2A4fPHZGo5NAMiNDyjmnKe4NiJ+Sf7D2kCycG6Df2Mai1AG5Vyzlj1IBCXsXm6MJ2sWmNCGoFZsFuxebaIKofaGFOCHCvqdJmRGBVHOT64BJSAXE676tzlfbCiSlJk+AH58BNvcXsLl7ID9+Ew16/C0Y4o7XmNIPDBJZ6y59BrgAAAAASUVORK5CYII=",
			deleteDark: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAJBJREFUOE+lk4ERgCAIRd2v5mmAdnCBdmiSBrIvgRKlV/ju/l0g/EPTkEkpufUwALOOtcD0kqsGYM0hFHURry28tpn8ZQCkWVRMgDSLiolgm0URss0iMhFaRT3RhERjzJ709pCpwReT2wETJrHnVEOHruV6rNTAPwHwnwEY+wtg7B7wh/8mqsD/FlTix2tM4QQu9ZqctQdDpAAAAABJRU5ErkJggg==",

			addLight: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAAAnklEQVRYR+3WQQqFMBRD0e5/bW7HcTWkZCRK+lBUcuAN+29m3zaj977s51rG8/shxqYlAwUxNi0ZKIixaclAQYxNSwYKYmxaMlAQY9Py04F4OHHrfi68Ofqt08PAV8vAqgysysCqDKzKwKpPDDz8k7645z4WZozHrnywCmJsWjJQEGPTkoGCGJuWDBTE2LRkoCDGpiUDBTE2LRMDW9sAWMFNgzVOe18AAAAASUVORK5CYII=",

			header: "data:image/png;base64,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",

			passMask: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADaSURBVDhP3ZEhDsJQEEQXRYLFQNAcggsguQJBYJHFARfAEByn4BAcgBNg0QhIMGVes0t+C01qMEzykv2zM23za/+prliIozg7zHjsatUShG4ir4EdGbIlYRxEBK9iJ+YOM17syZYekolYEu6IqvDYRY5OoYG4C8wthgt/5jCHyJClU/hrNy6ijSFNxUPE25jxEBmy+HTt5IcNB2koniLKAR47RBaP7vtyJhykpUiLKewQWc50rSf6Ij5/JarFgB0iS4fuh0biWxnYNVLcdEr6hxppLPYO8y9k9gJmuVYpcnk0owAAAABJRU5ErkJggg==",
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

		function fireEvent(elm, eventName) {
			var event = document.createEvent("HTMLEvents");
			event.initEvent(eventName, true, true);
			elm.dispatchEvent(event);
		}

		function addEventListeners(elm, eventNames, fn) {
			Array.forEach(eventNames, function(event) {
				elm.addEventListener(event, fn);
			});
		}

		function getContrastYIQ(hexcolor) {
			hexcolor = hexcolor.replace("#", "");
			var r = parseInt(hexcolor.substr(0, 2), 16),
				g = parseInt(hexcolor.substr(2, 2), 16),
				b = parseInt(hexcolor.substr(4, 2), 16),
				yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
			return (yiq >= 200);
		}

		var metroColors = ["#00AEDB", "#00B159", "#F37735", "#7C4199", "#FFC425", "#EC098C", "#D11141", "#000000"], metroColorsIndex = -1;

		var css =
            // layout;
            "#maincontent, #accountTD { display: inline-block; }" +

			// accounts;
			"#accountTD { font-size: 12px; width: 500px; min-height: 400px; margin: 5px; }" +
			"#accountTD .profile { text-transform: uppercase; color: #FFFFFF; cursor: pointer; float: left; height: 150px; position: relative; margin: 5px; padding: 5px; text-align: center; width: 150px; }" +
			"#accountTD .profile:hover{ opacity: 0.85; }" +
			"#accountTD .profile.dark { color: #000000; }" +
			"#accountTD .profile > img { max-height: 100px; max-width: 100px; vertical-align: middle; }" +
			"#accountTD .profile > span { bottom: 0; left: 0; margin: 5px; overflow: hidden; position: absolute; text-overflow: ellipsis; white-space: nowrap; width: 140px; }" +
			"#accountTD .profile > div { display: none; position: absolute; right: 0; top: 0; }" +
			"#accountTD .profile > div img { opacity: 0.3; margin: 4px 4px 0 0; }" +
			"#accountTD .profile:hover > div { display: block; }" +
			"#accountTD .profile:hover > div img:hover { opacity: 1; }" +

			// add account button;
			"#accountTD .addAccountBtn { opacity: 0.6; width: 100px; height: 100px; }" +
			"#accountTD .addAccountBtn:hover { opacity: 1; }" +
			"#accountTD .addAccountBtn > img { max-height: 40px; max-width: 40px; }" +
			"#accountTD .addAccountBtn > span { width: 90px; }" +
			"#accountTD .addAccountBtn > div { float: right; }" +

			// edit account;
			"#editAccountTD { display: none; position: relative; }" +
			"#editAccountTD .signInHeader img { position: relative; left: -34px; }" +
			"#editAccountTD .phholder { left: 0px; top: 0px; width: 100%; position: absolute; z-index: 5; cursor: text; }" +
			"#editAccountTD .alert-error { display: none; }" +
			"#editAccountCancel { background-color: #D11141; margin-left: 8px; }" +

			// password mask;
			".passMask { position: absolute; right: 8px; top: 8px; width: 16px; height: 16px; cursor: pointer; }";
		var stylesheet = document.createElement("style");
		stylesheet.type = "text/css";
		if (stylesheet.styleSheet) {
			stylesheet.styleSheet.cssText = css;
		} else {
			stylesheet.appendChild(document.createTextNode(css));
		}
		(document.head || document.getElementsByTagName("head")[0]).appendChild(stylesheet);

		var accountTD = document.createElement("div");
		accountTD.id = "accountTD";

		var mainTD = document.getElementById("maincontent");
		mainTD.parentNode.insertBefore(accountTD, mainTD);

		function paint() {
			profiles.forEach(function(profile, i) {
				if (!profile.color) {
					profile.color = metroColors[(metroColorsIndex = ++metroColorsIndex >= metroColors.length ? 0 : metroColorsIndex)];
					GM_setValue("MWLID.profiles", JSON.stringify(profiles));
				}
				var contrastDark = getContrastYIQ(profile.color);

				var profileDiv = document.createElement("div");
				profileDiv.classList.add("profile", contrastDark ? "dark" : "light");
				profileDiv.setAttribute("title", profile.mail);
				profileDiv.style.backgroundColor = profile.color;
				profileDiv.addEventListener("click", proxy(function(_event, _profile) {
					document.getElementById("i0116").value = _profile.mail;
                    fireEvent(document.getElementById("i0116"), "change");

                    document.getElementById("i0118").value = _profile.pass;
                    fireEvent(document.getElementById("i0118"), "change");

					if (autoLogin) {
						document.getElementById("idSIButton9").click();
					}
				}, profile));

				var profileImg = document.createElement("img");
				profileImg.classList.add("profileImg");
				profileImg.setAttribute("src", profile.photo || profile.img || (contrastDark ? image.photoDark : image.photoLight));

				var profileName = document.createElement("span");
				profileName.classList.add("profileName");
				profileName.appendChild(document.createTextNode(profile.name));

				var profileManage = document.createElement("div");
				profileManage.classList.add("profileManage");

				if (i !== 0) {
					var profileManageLeft = document.createElement("img");
					profileManageLeft.setAttribute("title", "Move to the left");
					profileManageLeft.setAttribute("src", contrastDark ? image.leftDark : image.leftLight);
					profileManage.appendChild(profileManageLeft);
					profileManageLeft.addEventListener("click", proxy(function(_event, _profile, _i) {
						_event.stopPropagation();

						var index = parseInt(_i, 10);

						if (parseInt(editAccountId.value, 10) === index) { editAccountId.value = index - 1; }

						var tmp = profiles[index];
						profiles[index] = profiles[index - 1];
						profiles[index - 1] = tmp;

						GM_setValue("MWLID.profiles", JSON.stringify(profiles));

						repaint();
					}, profile, i));
				}

				if (i !== (profiles.length - 1)) {
					var profileManageRight = document.createElement("img");
					profileManageRight.setAttribute("title", "Move to the right");
					profileManageRight.setAttribute("src", contrastDark ? image.rightDark : image.rightLight);
					profileManage.appendChild(profileManageRight);
					profileManageRight.addEventListener("click", proxy(function(_event, _profile, _i) {
						_event.stopPropagation();

						var index = parseInt(_i, 10);

						if (parseInt(editAccountId.value, 10) === index) { editAccountId.value = index + 1; }

						var tmp = profiles[index];
						profiles[index] = profiles[index + 1];
						profiles[index + 1] = tmp;

						GM_setValue("MWLID.profiles", JSON.stringify(profiles));

						repaint();
					}, profile, i));
				}

				var profileManageEdit = document.createElement("img");
				profileManageEdit.setAttribute("title", "Click to edit this account...");
				profileManageEdit.setAttribute("src", contrastDark ? image.editDark : image.editLight);
				profileManage.appendChild(profileManageEdit);
				profileManageEdit.addEventListener("click", proxy(function(_event, _profile, _i) {
					_event.stopPropagation();

					document.querySelector("#maincontent > section").style.display = "none";

					document.getElementById("editAccountTD").style.display = "block";

					setAccount(_i, _profile);
				}, profile, i));

				var profileManageDelete = document.createElement("img");
				profileManageDelete.setAttribute("title", "Delete this account!");
				profileManageDelete.setAttribute("src", contrastDark ? image.deleteDark : image.deleteLight);
				profileManage.appendChild(profileManageDelete);
				profileManageDelete.addEventListener("click", proxy(function(_event, _profile, _i) {
					_event.stopPropagation();

					if (window.confirm("Are you sure you want to delete this account?")) {
						profiles.splice(_i, 1);

						GM_setValue("MWLID.profiles", JSON.stringify(profiles));

						repaint();

						setAccount();
					}
				}, profile, i));

				accountTD.appendChild(profileDiv);
				profileDiv.appendChild(profileImg);
				profileDiv.appendChild(profileName);
				profileDiv.appendChild(profileManage);
			});

			var addAccountBtnDiv = document.createElement("div");
			addAccountBtnDiv.classList.add("profile", "addAccountBtn");
			addAccountBtnDiv.setAttribute("title", "Add account");
			addAccountBtnDiv.style.backgroundColor = "#0072C6";
			addAccountBtnDiv.addEventListener("click", function() {
				document.querySelector("#maincontent > section").style.display = "none";

				document.getElementById("editAccountTD").style.display = "block";

				setAccount();
			});

			var addAccountBtnImg = document.createElement("img");
			addAccountBtnImg.classList.add("profileImg");
			addAccountBtnImg.setAttribute("src", image.addLight);

			var addAccountBtnName = document.createElement("span");
			addAccountBtnName.classList.add("profileName");
			addAccountBtnName.appendChild(document.createTextNode("Add account"));

			accountTD.appendChild(addAccountBtnDiv);
			addAccountBtnDiv.appendChild(addAccountBtnImg);
			addAccountBtnDiv.appendChild(addAccountBtnName);
		}
		function repaint() {
			while (accountTD.hasChildNodes()) {
				accountTD.removeChild(accountTD.lastChild);
			}
			metroColorsIndex = -1;
			paint();
		}
		paint();

		var editAccountDiv = document.createElement("div");
		editAccountDiv.id = "editAccountTD";
		editAccountDiv.classList.add("floatLeft");
		editAccountDiv.innerHTML =
			'<div style="height: 40px;"></div>' +
			'<div id="i0272" class="signInHeader" style="height: 80px;">' +
				'<h1><img src="' + image.header + '" alt="Multiple Windows Live IDs" /></h1>' +
			'</div>' +
            '<input id="editAccountId" type="hidden" />' +
			'<div>' +
				'<div>' +
					'<div id="editAccountHeader1" class="row text-subheader">Add account</div>' +
					'<div id="editAccountHeader2" class="row text-subheader">Edit account</div>' +
					'<div class="form-group">'+
                    '   <div class="placeholderContainer"><input id="editAccountName"  class="form-control" type="text"    /><div class="phholder"><div class="placeholder">Name</div></div></div></div>' +
					'<div class="form-group">'+
                    '   <div class="alert alert-error" id="editAccountMailError">Please enter your email address in the format someone@example.com.</div>' +
                    '   <div class="placeholderContainer"><input id="editAccountMail"  class="form-control" type="email"   /><div class="phholder"><div class="placeholder">someone@example.com</div></div></div></div>' +
                    '<div class="form-group">'+
                    '   <div class="alert alert-error" id="editAccountPassError">Please enter the password for your Microsoft account.</div>' +
                    '   <div class="placeholderContainer"><input id="editAccountPass"  class="form-control" type="password"/><div class="phholder"><div class="placeholder">Password</div></div></div></div>' +
                    '<div class="form-group">'+
                    '   <div class="placeholderContainer"><input id="editAccountPhoto" class="form-control" type="text"    /><div class="phholder"><div class="placeholder">http://my.pictu.re/img.png</div></div></div></div>' +
                    '<div class="form-group">'+
                    '   <div class="placeholderContainer"><input id="editAccountColor" class="form-control" type="text"    /><div class="phholder"><div class="placeholder">#AB12CD</div></div></div></div>' +
				'</div>' +
				'<div class="section"><input id="editAccountSubmit" value="Submit" class="default" type="submit"/><input id="editAccountCancel" value="Cancel" class="default" type="submit"/></div>' +
				'<div class="section">Multiple Windows Live IDs. <a class="TextSemiBold" href="https://github.com/jerone/UserScripts/tree/master/Multiple_Windows_Live_IDs" target="_blank">More info...</a></div>' +
			'</div>';
		mainTD.appendChild(editAccountDiv);

		var editAccountHeader1 = document.getElementById("editAccountHeader1"),
			editAccountHeader2 = document.getElementById("editAccountHeader2"),

			editAccountId = document.getElementById("editAccountId"),
			editAccountName = document.getElementById("editAccountName"),
			editAccountMail = document.getElementById("editAccountMail"),
			editAccountPass = document.getElementById("editAccountPass"),
			editAccountPhoto = document.getElementById("editAccountPhoto"),
			editAccountColor = document.getElementById("editAccountColor"),

			editAccountMailError = document.getElementById("editAccountMailError"),
			editAccountPassError = document.getElementById("editAccountPassError");

		addPlaceHolders(editAccountName);
		addPlaceHolders(editAccountMail);
		addPlaceHolders(editAccountPass);
		addPlaceHolders(editAccountPhoto);
		addPlaceHolders(editAccountColor);

		if (addPassMask) { addPassMaskFn(editAccountPass); }

		document.getElementById("editAccountSubmit").addEventListener("click", function(e) {
            e.preventDefault();

			editAccountMailError.style.display = !editAccountMail.value ? "block" : "none";
			editAccountPassError.style.display = !editAccountPass.value ? "block" : "none";

			if (!editAccountPass.value || !editAccountMail.value) { return; }

			var index = parseInt(editAccountId.value, 10);
			profiles[index === -1 ? profiles.length : index] = {
				name: editAccountName.value,
				mail: editAccountMail.value,
				pass: editAccountPass.value,
				photo: editAccountPhoto.value,
				color: editAccountColor.value
			};

			GM_setValue("MWLID.profiles", JSON.stringify(profiles));

			repaint();

			document.querySelector("#maincontent > section").style.display = "block";

			document.getElementById("editAccountTD").style.display = "none";

			setAccount();
		});

		document.getElementById("editAccountCancel").addEventListener("click", function(e) {
            e.preventDefault();

			document.querySelector("#maincontent > section").style.display = "block";

			document.getElementById("editAccountTD").style.display = "none";

			setAccount();
		});

		function setAccount(id, profile) {
			profile = profile || {};

			editAccountHeader1.style.display = !id ? "block" : "none";
			editAccountHeader2.style.display = id ? "block" : "none";

			editAccountId.value = id != null ? id : -1;
			editAccountName.value = profile.name || "";
			editAccountMail.value = profile.mail || "";
			editAccountPass.value = profile.pass || "";
			editAccountPhoto.value = profile.photo || profile.img || "";
			editAccountColor.value = profile.color || metroColors[profiles.length % metroColors.length];

			fireEvent(editAccountName, "change");
			fireEvent(editAccountMail, "change");
			fireEvent(editAccountPass, "change");
			fireEvent(editAccountPhoto, "change");
			fireEvent(editAccountColor, "change");

			editAccountMailError.style.display = "";
			editAccountPassError.style.display = "";

			editAccountName.focus();
		}

		function addPlaceHolders(elm) {
			elm.parentNode.getElementsByClassName("phholder")[0].addEventListener("mouseup", function() {
				elm.focus();
			});
			addEventListeners(elm, ["change", "keyup", "keydown", "keypress"], function() {
				elm.parentNode.getElementsByClassName("phholder")[0].style.display = !elm.value ? "block" : "none";
			});
		}

		function addPassMaskFn(elm) {
			var img = document.createElement("img");
			img.classList.add("passMask");
			img.setAttribute("src", image.passMask);
			img.setAttribute("title", "Click to hide/show the password");
			img.style.display = elm.value ? "block" : "none";
			img.addEventListener("click", function() {
				elm.setAttribute("type", elm.getAttribute("type") === "password" ? "text" : "password");
			});
			addEventListeners(elm, ["change", "keyup", "keydown", "keypress"], function() {
				img.style.display = elm.value ? "block" : "none";
			});
			elm.parentNode.insertBefore(img, elm.nextSibling);
		}

		if (addPassMask) {
			addPassMaskFn(document.getElementById("i0118"));  // Microsoft password;
		}

	}, 500);
})();
