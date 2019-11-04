# [Github Reply Comments](https://github.com/jerone/UserScripts/tree/master/Github_Reply_Comments)

[![Install](https://raw.github.com/jerone/UserScripts/master/_resources/Install-button.png)](https://github.com/jerone/UserScripts/raw/master/Github_Reply_Comments/Github_Reply_Comments.user.js)
[![Source](https://raw.github.com/jerone/UserScripts/master/_resources/Source-button.png)](https://github.com/jerone/UserScripts/blob/master/Github_Reply_Comments/Github_Reply_Comments.user.js)
[![Donate](https://raw.github.com/jerone/UserScripts/master/_resources/Donate-button.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW)
[![Support](https://raw.github.com/jerone/UserScripts/master/_resources/Support-button.png)](https://github.com/jerone/UserScripts/issues)

## Description

You can reply to issues, pull requests and inline comments by pressing the
reply button on an comment.

## Screenshot

![Github Reply Comments Screenshot](https://github.com/jerone/UserScripts/raw/master/Github_Reply_Comments/screenshot.jpg)

## Compatible

*   ![](https://raw.github.com/jerone/UserScripts/master/_resources/Tampermonkey.png) [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/) on ![](https://raw.github.com/jerone/UserScripts/master/_resources/Firefox.png) [Mozilla Firefox](http://www.mozilla.org/en-US/firefox/fx/#desktop) desktop.

## Version History

*   version **1.0.3**

    *   🐛 Fix broken timestamp detection ([#149](https://github.com/jerone/UserScripts/issues/149)).

*   version **1.0.2**

    *   🐛 Fix broken icon url ([#146](https://github.com/jerone/UserScripts/pull/146)).

*   version **1.0.1**

    *   Use atx style headings, fenced code blocks, dense hr style.
    *   Remove trailing new line & ['Toggle code wrap'](https://greasyfork.org/en/scripts/18789-github-toggle-code-wrap) button from code blocks.
    *   Update [turndown-plugin-github-code-snippet](https://github.com/jerone/turndown-plugin-github-code-snippet).

*   version **1.0.0**

    *   Replace to-markdown with [Turndown](https://github.com/domchristie/turndown).
    *   Some clean up.
    *   Always fallback to Turndown when original comment code is not available.
    *   Convert code snippets back to links. Fixes [#144](https://github.com/jerone/UserScripts/issues/133).

*   version **0.1.2**

    *   Fix reply button for commits & reviews. Fixes [#133](https://github.com/jerone/UserScripts/issues/133).

*   version **0.1.1**

    *   Fix reply button for reviews. Fixes [#125](https://github.com/jerone/UserScripts/issues/125).

*   version **0.1.0**

    *   Initial version.

## Test cases

*   [https://github.com/jerone/UserScripts/issues/1](https://github.com/jerone/UserScripts/issues/1)
(issue comments)

*   [https://github.com/jerone/UserScripts/commit/036935761fc47e8c448378f2730a6ae8548fa8df](https://github.com/jerone/UserScripts/commit/036935761fc47e8c448378f2730a6ae8548fa8df)
(commit comments & inline comments)

*   [https://github.com/jerone/UserScripts/pull/49](https://github.com/jerone/UserScripts/pull/49)
(PR comments & PR review comments & [PR commit comments](https://github.com/jerone/UserScripts/pull/49/files))

*   [https://gist.github.com/jerone/9526258](https://gist.github.com/jerone/9526258) (comments)

## Dependencies

*   [Turndown](https://github.com/domchristie/turndown) - Convert HTML into Markdown with JavaScript.
*   [turndown-plugin-gfm](https://github.com/domchristie/turndown-plugin-gfm/blob/master/README.md) - A Turndown plugin which adds GitHub Flavored Markdown extensions.
*   [turndown-plugin-github-code-snippet](https://github.com/jerone/turndown-plugin-github-code-snippet) - A Turndown plugin to convert GitHub code snippet in comments back into normal links.

## External links

*   [Greasy Fork](https://greasyfork.org/en/scripts/38372-github-reply-comments)
*   [OpenUserJS](https://openuserjs.org/scripts/jerone/Github_Reply_Comments)
