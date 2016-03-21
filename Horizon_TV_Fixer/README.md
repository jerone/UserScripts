# [Horizon TV Fixer](https://github.com/jerone/UserScripts/tree/master/Horizon_TV_Fixer)

[![Install](https://raw.github.com/jerone/UserScripts/master/_resources/Install-button.png)](https://github.com/jerone/UserScripts/raw/master/Horizon_TV_Fixer/155147.user.js)
[![Source](https://raw.github.com/jerone/UserScripts/master/_resources/Source-button.png)](https://github.com/jerone/UserScripts/blob/master/Horizon_TV_Fixer/155147.user.js)
[![Donate](https://raw.github.com/jerone/UserScripts/master/_resources/Donate-button.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW)
[![Support](https://raw.github.com/jerone/UserScripts/master/_resources/Support-button.png)](https://github.com/jerone/UserScripts/issues)


## Description

Improves the [Horizon TV Gids](https://www.horizon.tv/nl_nl/tv-gids.html) by extending the functionality and the layout of the site.

* Add social share to Twitter;
* Add link to IMDb;
* Add link to Trakt.tv;
* Add link to Google;
* Add link to YouTube;
* Add link to KijkWijzer (Dutch);
* Add link to Uitzending Gemist (Dutch);
* Add link to IPTorrents;
* Remove redundant space;
* Reload page every 30 minutes;


## Screenshot

![Horizon TV Fixer screenshot](https://raw.github.com/jerone/UserScripts/master/Horizon_TV_Fixer/screenshot.jpg)


## Compatible

* [![](https://raw.github.com/jerone/UserScripts/master/_resources/Greasemonkey.png) Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/) on [![](https://raw.github.com/jerone/UserScripts/master/_resources/Firefox.png) Mozilla Firefox](http://www.mozilla.org/en-US/firefox/fx/#desktop) desktop.

This script doesn't work on browsers that don't implement [ES6 arrow functions](http://wiki.ecmascript.org/doku.php?id=harmony:arrow_function_syntax) syntax.


## Version History

* **30** (v1.1.107)
    * Compatibility fixes for v1.1.107;
* **29** (v1.1.96)
    * Compatibility fixes for v1.1.96;
* **28** (v1.1.92)
    * Compatibility fixes for v1.1.92;
* **27** (v1.1.91)
    * Add link to Trakt.tv;
* **26** (v1.1.83)
    * Show new Horizon Go logo;
    * Move genre to navigation row;
    * Current time indicator doesn't need an cursor;
* **25** (v1.1.78)
    * Compatibility fixes for v1.1.78;
* **24** (v1.1.76)
    * Compatibility fixes for v1.1.76;
    * Added 30 minutes reload back;
* **23** (v1.1.74)
    * Compatibility fixes for v1.1.74;
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
    * Compatibility fixes for v1.1.47;
* **17** (v1.1.37)
    * Compatibility fixes for v1.1.37;


## Notes

Get build version:
```
    console.log("Version: " + BBVSettingsObject.version.major + "." + BBVSettingsObject.version.minor + "." + BBVSettingsObject.version.micro);
```


## External links

* [Greasy Fork](https://greasyfork.org/scripts/65-horizon-tv-fixer)
* [OpenUserJS](https://openuserjs.org/scripts/jerone/Horizon_TV_Fixer)
