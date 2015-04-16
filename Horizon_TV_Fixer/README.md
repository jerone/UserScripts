# [Horizon TV Fixer](https://github.com/jerone/UserScripts/tree/master/Horizon_TV_Fixer)

[![Install](https://raw.github.com/jerone/UserScripts/master/_resources/Install-button.png)](https://github.com/jerone/UserScripts/raw/master/Horizon_TV_Fixer/155147.user.js)
[![Source](https://raw.github.com/jerone/UserScripts/master/_resources/Source-button.png)](https://github.com/jerone/UserScripts/blob/master/Horizon_TV_Fixer/155147.user.js)
[![Donate](https://raw.github.com/jerone/UserScripts/master/_resources/Donate-button.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW)
[![Support](https://raw.github.com/jerone/UserScripts/master/_resources/Support-button.png)](https://github.com/jerone/UserScripts/issues)


## Description

Improves the [Horizon TV Gids](https://www.horizon.tv/nl_nl/tv-gids.html) by extending the functionality and the layout of the site.

* Add social share to Twitter;
* Add link to IMDb;
* Add link to Google;
* Add link to YouTube;
* Add link to KijkWijzer (Dutch);
* Add link to Uitzending Gemist (Dutch);
* Add link to IPTorrents;
* Smaller listings to fit more channels;
* Remove redundand space;
* Reload page every 30 minutes;


## Screenshot

![Horizon TV Fixer screenshot](https://raw.github.com/jerone/UserScripts/master/Horizon_TV_Fixer/screenshot.jpg)


## Compatible

* [![](https://raw.github.com/jerone/UserScripts/master/_resources/Greasemonkey.png) Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/) on [![](https://raw.github.com/jerone/UserScripts/master/_resources/Firefox.png) Mozilla Firefox](http://www.mozilla.org/en-US/firefox/fx/#desktop) desktop.

<sub>Please [notify](https://github.com/jerone/UserScripts/issues/new?title=Userscript%20%3Cname%3E%20%28%3Cversion%3E%29%20also%20works%20in%20%3Cbrowser%3E%20on%20%3Cdesktop/device%3E) when this userscript is successfully tested in another browser...</sub>

This script doesn't work on browsers that don't implement [ES6 arrow functions](http://wiki.ecmascript.org/doku.php?id=harmony:arrow_function_syntax) syntax.


## Version History

* **vNext**
    * Show new Horizon Go logo;
    * Move genre to navigation row;
* **25** (v1.1.78)
    * Compatibily fixes for v1.1.78;
* **24** (v1.1.76)
    * Compatibily fixes for v1.1.76;
    * Added 30 minutes reload back;
* **23** (v1.1.74)
    * Compatibily fixes for v1.1.74;
* **22** (v1.1.72)
    * Fixed smaller font size;
    * Fixed smaller listings for .short listing;
* **21** (v1.1.70)
    * HTTPS icons;
    * Move time arrow higher (result of new version 1.1.70);
    * Smaller font size in listing;
* **20** (v1.1.67)
    * Removed previous "Kijk Live TV" logic;
    * Smaller listings to fit more channels;
* **19** (v1.1.57)
    * Removed `GM_addStyle` as it gives errors in GreaseMonkey (not Scriptish);
* **18** (v1.1.47)
    * Compatibily fixes for v1.1.47;
* **17** (v1.1.37)
    * Compatibily fixes for v1.1.37;


## Notes

Build for version 1.1.83
```
    console.log("Version: " + unsafeWindow.BBVSettingsObject.version.major + "." + unsafeWindow.BBVSettingsObject.version.minor + "." + unsafeWindow.BBVSettingsObject.version.micro);
```


## External links

* [Greasy Fork](https://greasyfork.org/scripts/65-horizon-tv-fixer)
* [OpenUserJS](https://openuserjs.org/scripts/jerone/Horizon_TV_Fixer)
