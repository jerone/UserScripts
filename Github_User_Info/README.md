# [Github User Info](https://github.com/jerone/UserScripts/tree/master/Github_User_Info)

[![Install](https://raw.github.com/jerone/UserScripts/master/_resources/Install-button.png)](https://github.com/jerone/UserScripts/raw/master/Github_User_Info/Github_User_Info.user.js)
[![Source](https://raw.github.com/jerone/UserScripts/master/_resources/Source-button.png)](https://github.com/jerone/UserScripts/blob/master/Github_User_Info/Github_User_Info.user.js)
[![Donate](https://raw.github.com/jerone/UserScripts/master/_resources/Donate-button.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW)
[![Support](https://raw.github.com/jerone/UserScripts/master/_resources/Support-button.png)](https://github.com/jerone/UserScripts/issues)


## Description

Show user/organization information on avatar hover.


## Screenshot

![Github User Info Screenshot](https://github.com/jerone/UserScripts/raw/master/Github_User_Info/screenshot.jpg)


## Compatible

*   ![](https://raw.github.com/jerone/UserScripts/master/_resources/Tampermonkey.png) [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/) on ![](https://raw.github.com/jerone/UserScripts/master/_resources/Firefox.png) [Mozilla Firefox](http://www.mozilla.org/en-US/firefox/fx/#desktop) desktop.


## Version History

*   **0.4.0**
    *   We're only fetching one page of all members
    *   Use flexbox css for counts
    *   Fix showing joined date
    *   Remove console messages
*   **0.3.5**
    *   Fixed issues after recent layout updates
*   **0.3.4**
    *   Fixed some styling
*   **0.3.3**
    *   Smoother avatar loading on non-cached user info
*   **0.3.2**
    *   Add support for following & followers page
    *   Add support for trending developer
*   **0.3.1**
    *   Add support for authored committed users
*   **0.3.0**
    *   Add support for GitHub Gist (fixes [#55](https://github.com/jerone/UserScripts/issues/55))
*   **0.2.1**
    *   Fixed local time on second hover (fixes [#53](https://github.com/jerone/UserScripts/issues/53))
    *   Added members count for orgs (closes [#54](https://github.com/jerone/UserScripts/issues/54))
*   **0.2.0**
    *   Make location linkable to Google Maps
    *   Added admin/staff recognition
    *   User with all counts and 4 digit numbers, stretching popup
    *   Don't error on API limit exceeded
    *   Fixed not saving data
    *   Always fill name
    *   Added organization count
    *   Fixed z-index
    *   Added missing hover effect on counts
    *   Better shadow
    *   Also run on homepage news feed
    *   Really fixing pjax events now; <https://gist.github.com/jerone/e38e8637887559870d84>
    *   Animate avatar
    *   Hide user counts when no counts are available
    *   Added some logging
    *   Added class to identify element
    *   Added username fallback when no name
*   **0.1.0**
    *   Initial version


## Notes

Use cases:

*   <https://github.com/jerone> (User)
*   <https://api.github.com/users/jerone> (API user)
*   <https://github.com/github> (Organisation with admin users)
*   <https://api.github.com/> (Read your API limit)
*   <https://developer.github.com/v3/> (API Documentation)


## External links

*   [Greasy Fork](https://greasyfork.org/en/scripts/8989-github-user-info)
*   [OpenUserJS](https://openuserjs.org/scripts/jerone/Github_User_Info)
