# [Github News Feed Filter](https://github.com/jerone/UserScripts/tree/master/Github_News_Feed_Filter)

[![Install](https://raw.github.com/jerone/UserScripts/master/_resources/Install-button.png)](https://github.com/jerone/UserScripts/raw/master/Github_News_Feed_Filter/Github_News_Feed_Filter.user.js)
[![Source](https://raw.github.com/jerone/UserScripts/master/_resources/Source-button.png)](https://github.com/jerone/UserScripts/blob/master/Github_News_Feed_Filter/Github_News_Feed_Filter.user.js)
[![Donate](https://raw.github.com/jerone/UserScripts/master/_resources/Donate-button.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW)
[![Support](https://raw.github.com/jerone/UserScripts/master/_resources/Support-button.png)](https://github.com/jerone/UserScripts/issues)


## Description

Add filters for [Github homepage](https://github.com) news feed items.

This script also works for organizations and on user profiles [public activity](https://github.com/jerone?tab=activity) (page refresh is required).

Currently integrated filters:

* Actions
    * Issues
        * Opened
        * Closed
        * Reopened
        * Comments
    * Commits
        * Pushed
        * Comments
    * Pull Requests
        * Opened
        * Closed
        * Merged
        * Comments
    * Repo
        * Created
        * Public
        * Forked
        * Deleted
        * Release
        * Branch
            * Created
            * Deleted
        * Tag
            * Added
            * Removed
    * User
        * Starred
        * Member added
    * Wiki
        * Created
        * Edited
    * Gist
        * Created
        * Updated
* Repositories
    * _Variable on the repos currently in your news list_


## Screenshot

![Github News Feed Filter screenshot](https://github.com/jerone/UserScripts/raw/master/Github_News_Feed_Filter/screenshot.png)


## Compatible

* [![](https://raw.github.com/jerone/UserScripts/master/_resources/Greasemonkey.png) Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/) on [![](https://raw.github.com/jerone/UserScripts/master/_resources/Firefox.png) Mozilla Firefox](http://www.mozilla.org/en-US/firefox/fx/#desktop) desktop.

<sub>Please [notify](https://github.com/jerone/UserScripts/issues/new?title=Userscript%20%3Cname%3E%20%28%3Cversion%3E%29%20also%20works%20in%20%3Cbrowser%3E%20on%20%3Cdesktop/device%3E) when this userscript is successfully tested in another browser...</sub>


## Version History
* **7.0.0**
    * Restored icons after GitHub switching to SVG;
* **6.2**
    * :sparkles: Filter by repo. Fixes [#70](https://github.com/jerone/UserScripts/issues/70);
* **6.1**
    * :bug: Fixed counting repo releases as tag actions;
    * :sparkles: Split wiki filter in created and edited;
* **6.0**
    * Fixed issues after Github site update (https://github.com/jerone/UserScripts/issues/68);
* **5.3**
    * Added filter history support;
* **5.2**
    * Fixed issues after Github site update (https://github.com/jerone/UserScripts/issues/6);
* **5.1**
    * Added support for user public activity;
* **5.0**
    * More filters added;
* **4.6**
    * Show message when filter has no feed items;
* **4.5**
    * Added branch deleting support;
* **4.4**
    * Added support for organisations;
    * Added commit comments;
* **4.3**
    * Reordered menu;
    * Expanded Gist create & update;
    * Changed Starred in User actions and added member add;
* **4.2**
    * Added support for Scriptish;
* **4.1**
    * Added fork filter;
    * Added sub-filters for issues (comments, opened, closed, reopened);
* **4.0**
    * Better integrated menu style;
* **3.1**
    * Moved PR comments to PR filter;
* **3.0**
    * Added Stars, Repo and Wiki filter;
    * Moved Comments to Issues filter;
    * Made menu lower;
* **2.0**
    * Added Pull Requests filter;
* **1.0**
    * Initial version;


## TODO

- ~~Run on users public activity stream (https://github.com/jerone?tab=activity);~~ _Only works on direct access._
- ~~Filter by repo~~;
- Filter by user;


## External links

* [Greasy Fork](https://greasyfork.org/scripts/171-github-news-feed-filter)
* [OpenUserJS](https://openuserjs.org/scripts/jerone/Github_News_Feed_Filter)
