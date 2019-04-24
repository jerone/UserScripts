// ==UserScript==
// @name        Github Commit Whitespace
// @namespace   https://github.com/jerone/UserScripts
// @description Adds button to hide whitespaces from commit
// @author      jerone
// @copyright   2014+, jerone (http://jeroenvanwarmerdam.nl)
// @license     CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license     GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @homepage    https://github.com/jerone/UserScripts/tree/master/Github_Commit_Whitespace
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Github_Commit_Whitespace
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Github_Commit_Whitespace/Github_Commit_Whitespace.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Github_Commit_Whitespace/Github_Commit_Whitespace.user.js
// @supportURL  https://github.com/jerone/UserScripts/issues
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @icon        https://github.githubassets.com/pinned-octocat.svg
// @include     https://github.com/*
// @version     1.5.4
// @grant       none
// ==/UserScript==

(function() {

    function addButton() {
        var e
        if ((/\/commit\//.test(location.href) || /\/compare\//.test(location.href)) && (e = document.getElementById('toc'))) {

            var r = e.querySelector('.GithubCommitWhitespaceButton')
            if (r) {
                r.parentElement.removeChild(r)
            }

            var on = /w=/.test(location.search) // Any occurense results in enabling

            var b = e.querySelector('.toc-diff-stats')

            var a = document.createElement('a')
            a.classList.add('btn', 'btn-sm', 'tooltipped', 'tooltipped-n')
            if (on) {
                a.classList.add('selected')
            }
            a.setAttribute('href', url(on))
            a.setAttribute('rel', 'nofollow')
            a.setAttribute('aria-label', on ? 'Show commit whitespace' : 'Hide commit whitespace')
            a.appendChild(document.createTextNode('\u2423'))

            var g = document.createElement('div')
            g.classList.add('GithubCommitWhitespaceButton', 'float-right')
            g.style.margin = '0 10px 0 0' // Give us some room
            g.appendChild(a)

            b.parentNode.insertBefore(g, b)
        } else if (/\/pull\/\d*\/(files|commits)/.test(location.href) && (e = document.querySelector('#files_bucket .pr-toolbar .diffbar > .float-right'))) {

            var r = e.querySelector('.GithubCommitWhitespaceButton')
            if (r) {
                r.parentElement.removeChild(r)
            }

            var on = /w=/.test(location.search) // Any occurense result in enabling

            var a = document.createElement('a')
            a.classList.add('btn', 'btn-sm', 'btn-outline', 'tooltipped', 'tooltipped-s')
            a.setAttribute('href', url(on))
            a.setAttribute('rel', 'nofollow')
            a.setAttribute('aria-label', on ? 'Show commit whitespace' : 'Hide commit whitespace')
            a.appendChild(document.createTextNode('\u2423'))

            var g = document.createElement('div')
            g.classList.add('GithubCommitWhitespaceButton', 'diffbar-item')
            g.appendChild(a)

            e.insertBefore(g, e.firstChild)
        }
    }

    function url(on) {
        var searches = location.search.replace(/^\?/, '').split('&').filter(function(item) {
            return item && !/w=.*/.test(item)
        })
        if (!on) {
            searches.push('w=1')
        }
        return location.href.replace(location.search, '').replace(location.hash, '') + (searches.length > 0 ? '?' + searches.join('&') : '') + location.hash;
    }

    // Init
    addButton()

    // Pjax
    document.addEventListener('pjax:end', addButton)

})()
