# [Github News Feed Filter](https://github.com/jerone/UserScripts/tree/master/Github_News_Feed_Filter)

[![Install](https://raw.github.com/jerone/UserScripts/master/_resources/Install-button.png)](https://github.com/jerone/UserScripts/raw/master/Github_News_Feed_Filter/Github_News_Feed_Filter.user.js)
[![Source](https://raw.github.com/jerone/UserScripts/master/_resources/Source-button.png)](https://github.com/jerone/UserScripts/blob/master/Github_News_Feed_Filter/Github_News_Feed_Filter.user.js)
[![Donate](https://raw.github.com/jerone/UserScripts/master/_resources/Donate-button.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW)
[![Support](https://raw.github.com/jerone/UserScripts/master/_resources/Support-button.png)](https://github.com/jerone/UserScripts/issues)

## Description

Add filters for [GitHub homepage](https://github.com) news feed items.

This script also works for organizations.

Currently integrated filters:

*   **Actions**

    *   Commits

        *   Pushed
        *   Comments

    *   Repo

        *   Created

        *   Public

        *   Forked

        *   Deleted

        *   Release

        *   Branch

            *   Created
            *   Deleted

        *   Tag

            *   Added
            *   Removed

    *   Follow

    *   Starred

    *   Wiki

        *   Created
        *   Edited

*   **Repositories**

    *   _Variable on the repos currently in your news list._

*   **Users**

    *   _Variable on the users currently in your news list._

## Screenshot

![Github News Feed Filter screenshot](https://github.com/jerone/UserScripts/raw/master/Github_News_Feed_Filter/screenshot.png)

## Compatible

*   ![](https://raw.github.com/jerone/UserScripts/master/_resources/Tampermonkey.png) [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/) on ![](https://raw.github.com/jerone/UserScripts/master/_resources/Firefox.png) [Mozilla Firefox](http://www.mozilla.org/en-US/firefox/fx/#desktop) desktop.

## Version History

*   **8.2.7**
 
    *   🐛 Fix after another layout change. Refixes [#68](https://github.com/jerone/UserScripts/issues/68).

*   **8.2.6**
 
    *   🐛 Fix after another layout change. Refixes [#68](https://github.com/jerone/UserScripts/issues/68) with [#140](https://github.com/jerone/UserScripts/pull/140) (thanks [@darkred](https://github.com/darkred)).

*   **8.2.5**
 
    *   🐛 Fix showing filter. Fixes [#137](https://github.com/jerone/UserScripts/issues/137).

*   **8.2.4**
 
    *   🐛 Nav styling. Fixes [#130](https://github.com/jerone/UserScripts/issues/130) and closes [#132](https://github.com/jerone/UserScripts/issues/132) (thanks [@darkred](https://github.com/darkred)).

*   **8.2.3**

    *   ✨ Re-added of the "Issues" filter ( Issues|Labeled ) which was removed per [#121 (comment)](https://github.com/jerone/UserScripts/issues/121#issuecomment-336629514) after another GitHub site update (by [@darkred](https://github.com/darkred)).

*   **8.2.2**

    *   🐛 Fix after another layout change.

*   **8.2.1**

    *   🐛 Fix for 'Actions' tab|'Wiki' being empty after GitHub site update (fixed by [@darkred](https://github.com/darkred) in [#127](https://github.com/jerone/UserScripts/issues/127)).
    *   🐛 Fix missing created repo actions.

*   **8.2.0**

    *   🐛 Fixed issues after GitHub site update ([#124](https://github.com/jerone/UserScripts/issues/124)).

*   **8.1.1**

    *   🐛 Fix the 'Repositories' tab being empty ([#124](https://github.com/jerone/UserScripts/issues/124), fixed by [@darkred](https://github.com/darkred) in [#126](https://github.com/jerone/UserScripts/pull/126)).

*   **8.1.0**

    *   🐛 Ignore repo detection on follow alerts.
    *   ✨ Filter by follow action.

*   **8.0.0**

    *   Fixed issues after GitHub site update ([#121](https://github.com/jerone/UserScripts/issues/121)).

        GitHub completely redesigned the news feed and removed the issue, PR, member adding and gist related news items.

*   **7.2.0**

    *   ✨ Filter by user.

*   **7.1.0**

    *   🐛 Fixed issues after layout updates. Closes [#114](https://github.com/jerone/UserScripts/pull/114).

*   **7.0.1**

    *   🐛 Fixed falsely identification branch creation and deletion.

*   **7.0.0**

    *   Restored icons after GitHub switching to SVG.

*   **6.2**

    *   ✨ Filter by repo. Fixes [#70](https://github.com/jerone/UserScripts/issues/70).

*   **6.1**

    *   🐛 Fixed counting repo releases as tag actions.
    *   ✨ Split wiki filter in created and edited.

*   **6.0**

    *   Fixed issues after GitHub site update ([#68](https://github.com/jerone/UserScripts/issues/68)).

*   **5.3**

    *   Added filter history support.

*   **5.2**

    *   Fixed issues after GitHub site update ([#6](https://github.com/jerone/UserScripts/issues/6)).

*   **5.1**

    *   Added support for user public activity.

*   **5.0**

    *   More filters added.

*   **4.6**

    *   Show message when filter has no feed items.

*   **4.5**

    *   Added branch deleting support.

*   **4.4**

    *   Added support for organizations.
    *   Added commit comments.

*   **4.3**

    *   Reordered menu.
    *   Expanded Gist create & update.
    *   Changed Starred in User actions and added member add.

*   **4.2**

    *   Added support for Scriptish.

*   **4.1**

    *   Added fork filter.
    *   Added sub-filters for issues (comments, opened, closed, reopened).

*   **4.0**

    *   Better integrated menu style.

*   **3.1**

    *   Moved PR comments to PR filter.

*   **3.0**

    *   Added Stars, Repo and Wiki filter.
    *   Moved Comments to Issues filter.
    *   Made menu lower.

*   **2.0**

    *   Added Pull Requests filter.

*   **1.0**

    *   Initial version.

## Contributors

*   [darkred](https://github.com/darkred)

## External links

*   [Greasy Fork](https://greasyfork.org/scripts/171-github-news-feed-filter)
*   [OpenUserJS](https://openuserjs.org/scripts/jerone/Github_News_Feed_Filter)
