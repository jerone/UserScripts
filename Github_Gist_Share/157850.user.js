// ==UserScript==
// @name             Github Gist Share
// @namespace        https://github.com/jerone/UserScripts/
// @description      Share your GitHub Gist to Twitter, Dabblet, Bl.ocks & as userscript.
// @author           jerone
// @copyright        2014+, jerone (https://github.com/jerone)
// @license          CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license          GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @homepage         https://github.com/jerone/UserScripts/tree/master/Github_Gist_Share
// @homepageURL      https://github.com/jerone/UserScripts/tree/master/Github_Gist_Share
// @downloadURL      https://github.com/jerone/UserScripts/raw/master/Github_Gist_Share/157850.user.js
// @updateURL        https://github.com/jerone/UserScripts/raw/master/Github_Gist_Share/157850.user.js
// @supportURL       https://github.com/jerone/UserScripts/issues
// @contributionURL  https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @icon             https://github.githubassets.com/pinned-octocat.svg
// @include          *://gist.github.com/*
// @version          5.1
// @grant            none
// ==/UserScript==

// cSpell:ignore Dabblet, Bl.ocks, itemprop, tweetbutton

(function() {

    String.format = function(string) {
        const args = Array.prototype.slice.call(arguments, 1, arguments.length)
        return string.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match
        })
    }

    function Menu(container) {
        const div$0$0 = document.createElement('div')
        div$0$0.classList.add('file-navigation-option')
        div$0$0.id = 'Github_Gist_Share'
        container.insertBefore(div$0$0, container.firstChild)

        const div$1$0 = document.createElement('div')
        div$1$0.classList.add('select-menu', 'js-menu-container', 'select-menu-modal-left', 'js-select-menu')
        div$0$0.appendChild(div$1$0)

        const button$2$0 = document.createElement('button')
        button$2$0.classList.add('btn', 'btn-sm', 'select-menu-button', 'icon-only', 'js-menu-target')
        button$2$0.setAttribute('type', 'button')
        div$1$0.appendChild(button$2$0)

        const svg$3$0 = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg$3$0.classList.add('octicon', 'octicon-link-external')
        svg$3$0.setAttributeNS(null, 'height', 16)
        svg$3$0.setAttributeNS(null, 'version', '1.1')
        svg$3$0.setAttributeNS(null, 'viewBox', '0 0 12 16')
        svg$3$0.setAttributeNS(null, 'width', 12)
        button$2$0.appendChild(svg$3$0)

        const path$4$0 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path$4$0.setAttributeNS(null, 'd', 'M11 10h1v3c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h3v1H1v10h10v-3zM6 2l2.25 2.25L5 7.5 6.5 9l3.25-3.25L12 8V2H6z')
        svg$3$0.appendChild(path$4$0)

        button$2$0.appendChild(document.createTextNode(' Share '))

        const div$2$1 = document.createElement('div')
        div$2$1.classList.add('select-menu-modal-holder')
        div$1$0.appendChild(div$2$1)

        const div$3$0 = document.createElement('div')
        div$3$0.classList.add('select-menu-modal', 'select-menu-modal', 'js-menu-content')
        div$2$1.appendChild(div$3$0)

        const div$4$0 = document.createElement('div')
        div$4$0.classList.add('select-menu-header')
        div$3$0.appendChild(div$4$0)

        const svg$5$0 = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg$5$0.classList.add('octicon', 'octicon-x', 'js-menu-close')
        svg$5$0.setAttributeNS(null, 'height', 16)
        svg$5$0.setAttributeNS(null, 'version', '1.1')
        svg$5$0.setAttributeNS(null, 'viewBox', '0 0 12 16')
        svg$5$0.setAttributeNS(null, 'width', 12)
        div$4$0.appendChild(svg$5$0)

        const path$6$0 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path$6$0.setAttributeNS(null, 'd', 'M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48z')
        svg$5$0.appendChild(path$6$0)

        const span$5$1 = document.createElement('span')
        span$5$1.classList.add('select-menu-title')
        div$4$0.appendChild(span$5$1)

        span$5$1.appendChild(document.createTextNode('Share Gist with…'))

        const div$4$1 = document.createElement('div')
        div$4$1.classList.add('select-menu-list', 'js-navigation-container')
        div$3$0.appendChild(div$4$1)

        this.itemsContainer = div$4$1
    }

    Menu.prototype.AddItem = function(text, title, href, icon, newTab) {
        const a = document.createElement('a')
        a.classList.add('select-menu-item', 'js-navigation-item')
        a.setAttribute('href', href)
        if (title) a.setAttribute('title', title)
        if (newTab) a.setAttribute('target', '_blank')
        this.itemsContainer.appendChild(a)

        const i = document.createElement('img')
        i.classList.add('select-menu-item-icon')
        i.setAttribute('src', icon)
        a.appendChild(i)

        const s = document.createElement('span')
        s.classList.add('select-menu-item-text')
        a.appendChild(s)

        s.appendChild(document.createTextNode(text))
    }

    function getValue(elm) {
        return elm ? elm.textContent.trim() : ''
    }

    function getIntValue(elm) {
        return elm ? parseInt(elm.textContent.trim(), 10) : 0
    }

    function addMenu() {
        const link = document.querySelector('.gist-header-title a')
        const nav = document.querySelector('.file-navigation-options')
        if (link && nav) { // Check if we're on an actual gist
            const data = {
                url: link.href,
                user: getValue(document.querySelector('.header-nav-current-user strong')),
                author: getValue(document.querySelector('.author [itemprop="author"]')),
                description: getValue(document.querySelector('.repository-meta-content') || link),
                files: document.querySelectorAll('.file').length,
                stars: getIntValue(document.querySelector('a[href$="/stargazers"] .counter, form[action$="/star"] .social-count')),
                forks: getIntValue(document.querySelector('a[href$="/forks"] .counter, form[action$="/fork"] .social-count')),
                revisions: getIntValue(document.querySelector('a[href$="/revisions"] .counter'))
            }

            console.log(data)

            const menu = new Menu(nav)

            // Twitter
            if (true) {
                const stats = []
                if (data.files > 1) {
                    stats.push(data.files + ' files')
                }
                if (data.stars === 1) {
                    stats.push(data.stars + ' star')
                } else if (data.stars > 1) {
                    stats.push(data.stars + ' stars')
                }
                if (data.forks === 1) {
                    stats.push(data.forks + ' fork')
                } else if (data.forks > 1) {
                    stats.push(data.forks + ' forks')
                }
                if (data.revisions > 1) {
                    stats.push(data.revisions + ' revisions')
                }

                const tweet = String.format('Check out {0} #gist {1} on @github {2}',
                    data.author === data.user ? 'my' : data.author + "'s",
                    data.description ? '"' + data.description + '"' : '',
                    stats.length > 0 ? String.format('- {0} -', stats.join(', ')) : '-')

                const link = 'https://twitter.com/intent/tweet' +
                    '?original_referer=' + encodeURIComponent(data.url) +
                    '&source=tweetbutton&url=' + encodeURIComponent(data.url) +
                    '&text=' + encodeURIComponent(tweet)

                const icon = 'data:image/vnd.microsoft.icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAD///8A////A////xT///8f////K////yj///8f////FP///wP///8A////AP///wD///8A////AP///wD///8A////H/357kj55K589tV+ofPFUML0y1+29tV+ofnkrnz9+e5I////H////wP///8A////AP///wD///8A////ANi/foG2iBDuvYkA/9CWAP/npwD/7qwA/+6sAP/urAD/7rAP8/bVfqH9+e8/////A////wD///8A////AP///wD///8A////APDnzjDjx36N3Kcf5e6sAP/urAD/7qwA/+6sAP/urAD/8bww2/357z////8D////AP///wD///8A////AP///wP///8z+N+eifTLX7burAD/7qwA/+6sAP/urAD/7qwA/+6sAP/xvDDb/PjvM////wD///8A////AP///wD69+8V2Kkw1eqpAP/urAD/7qwA/+6sAP/urAD/7qwA/+6sAP/urAD/7qwA//TLX7b///8H////AP///wD///8A+fLfPvbVfqHusA/z7qwA/+6sAP/urAD/7qwA/+6sAP/urAD/7qwA/+6sAP/urAD/+fLfPv///wD///8A////DPXQcKvurAD/7qwA/+6sAP/urAD/7qwA/+6sAP/urAD/7qwA/+6sAP/urAD/7qwA/+/Lb6f///8A////APPpzzzUmQD/7qwA/+6sAP/urAD/7qwA/+enAP/npwD/7qwA/+6sAP/urAD/7qwA/+6sAP/xvDDb////AP///wDt4L5G9dBwq+6sAP/urAD/2JwA/7qGAP+7kCDe1qMf4+6sAP/urAD/7qwA/+6sAP/urAD/7qwA/////yT///8A9/DeLu6sAP/npwD/vYkA/8+wYJ/1794f////AOXIfo7urAD/7qwA/+6sAP/urAD/7qwA/+6sAP/zznCo////KO7hv0jjpAD/vpIf4PDnzjD///8A////AP///wDeyI5x46QA/+6sAP/urAD/7qwA/+qpAP/UmQD/5KkO89u4YKfw584ww5ov0Pr37g////8A////AP///wD///8A+vfuD8OaL9DUmQD/36EA/9icAP+9jA/w07hwjsCYMM/p2a9U////APr37g////8A////AP///wD///8A////AP///wD69+4P07hwjsWgQL/PsGCf9e/eH////wD///8A9e/eH////wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A//8AAOH/AAAAPwAA4B8AAOAPAADABwAAwAcAAIADAACAAwAAgAMAAIYBAACfAAAAvwEAAP+PAAD//wAA//8AAA==';

                menu.AddItem('Twitter', tweet + ' ' + data.url, link, icon, true)
            }

            // Userscripts
            if (document.querySelector('.file .file-actions a[href$=".user.js" i]')) {
                const icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKwSURBVHjabJNJTBNRGID/mc5MQYVWVNCGTbEtNZGDBj1ogolEMR5UJA2LBmMoIokxERIj8ehJjx6MYIQoJgq4JIa6gEARkKJFTa2iFFtKWwp2oeDCzNQ+31DQCc5L/nmT/P/3749ACAFBECBxiEPFFds0Ws399DRVhtX2udc97ig0PmgOLBkIbOwjAR8uMRRdvXF7pqv/NfrqnEAOlxsdLas6j3Wk2AEpCRcbKvLydrdu1WUr0lXrITEhAZKUSkhQKvKwXiY2ppbDRzCcv29P/ZZsDaSqUkCJYVJGwKMnHTDlmWgTZ/CvjkW4sKTScP1WC+oZsKAxpwv5gyEUnAkj2xc70p88Y8Y2a8VBxT0gispOGa413UVDb23IMe6OwaEw+jTqQKMOF3pptqBSw7k74hLEPaDUOu0VmpFDV58ZCJIAkiDB5fUBz0eApmjQqbOgrqa69HhVbZO4jKUfmiBJBctysHJFPPiDYbA7J4DjeJDLaWAYGVAyErIy0uDs6RPH9OXVtULWYgfEmN3emJK8BlYrEsHl8cEvloX4ODnEyRlgKGZhV1iOhcz0VNixM7dOCCp2EBkeMF3u6DaNqDasg1U4CzlFxxSRKMyz8xjmsPAQwNmRsc2jxGPkR0esHp7n9RBFrYbyUi1DUzh1GujFG0UBQrNz8P7DR3j+9NklqTEK3VVkbNLkVNZc9AwNW5Hb60PT/gCamg6gEbsT3XvYjvIP6i9gu2ShhOWb+BvLD13O9o3azWrVdy4K3wKhv5HfWW1Q39BY19nechPbzQrVwX9bhU+iIqnyQMF+mPvJQr/FCsHwDJgG30ADhl8Y2wQ4jIUVkpdaZRnPcd6AfxomJ32AIhEwdvaC8XG7JLwwvmXPmVFn52Tu2lvQjN9Crn3M6bWY+6otr3oGpWCB/SPAAJaJRguGUxB0AAAAAElFTkSuQmCC';
                const userscripts = document.querySelectorAll('.file .file-actions a[href$=".user.js"]')
                Array.prototype.forEach.call(userscripts, function(userscript) {
                    const text = String.format('Userscript "{0}"', userscript.href.split('/').pop())
                    menu.AddItem(text, null, userscript.href, icon, false)
                })
            }

            // Dabblet
            if (document.querySelector('.file .type-css, .file .type-html, .file .type-javascript')) {
                const link = 'http://dabblet.com/gist/' + data.url.split('/').pop()
                const icon = 'data:image/vnd.microsoft.icon;base64,AAABAAEAEBAAAAAAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAAAAD///8B////AQAAAAMAAAAPAAAAHwAAACcAAAAfAAAADwAAAAP///8B////AQAAAAUAAAARAAAAHwAAAB0AAAAJ////AQAAAAcAAAAjqqqqb9vb28Xn5+fb29vbxaqqqm8AAAAjAAAABwAAAAkAAAApvLy8hd7e3snl5eXBAAAAIwAAAAMAAAAjzc3Nqf39/f/////////////////9/f3/0NDQqQAAACEAAAAp2NjYvf///////////////wAAADEAAAAPra2tc/39/f////////////b29vn///////////39/f8AAABFvLy8jf///////////f39/97e3r8AAAAhAAAAIdzc3Mf//////////66urp8AAABNrq6un///////////AAAAXePj49v//////Pz8/YqKin0AAAAlAAAACQAAACnq6urj//////Hx8fUAAABJAAAADQAAAEnv7+/z/////wAAAGXx8fHz/////+Tk5N8AAAAzAAAAA////wEAAAAh3d3dy///////////l5eXjQAAAEWXl5eN//////////8AAABp9fX19f/////g4ODVAAAAKf///wH///8BAAAAEbm5uYP///////////39/f/u7u7x/f39////////////AAAAafX19fX/////4ODg1QAAACn///8B////AQAAAAUAAAAn19fXu////////////////////////////////wAAAGn19fX1/////93d3dtoaGhXXFxcJwAAAAv///8BAAAABwAAACe5ubmF4+Pj1e/v7+nd3d3f8/Pz+f////8AAABp9fX19f/////c3Nzl7e3t5+zs7M0AAAAh////Af///wEAAAAFAAAAEwAAACUAAAAtAAAAU+np6ev/////AAAAafX19fX/////3Nzc5e3t7efs7OzNAAAAIf///wH///8B////Af///wH///8B////AQAAAC/r6+vn/////wAAAGn19fX1/////93d3dtpaWlVXFxcJwAAAAv///8B////Af///wH///8B////Af///wEAAAAh5ubm0/////8AAABd9fX18f/////i4uLLAAAAH////wH///8B////Af///wH///8B////Af///wH///8BAAAADXR0dEXs7Oy/AAAANbm5uXvz8/PjkpKSVQAAAA3///8B////Af///wH///8B////Af///wH///8B////Af///wEAAAALAAAAFQAAAA0AAAAVAAAAHwAAAA////8B////Af///wH///8B////Af///wH///8B////Af///wH///8B////Af///wH///8B////Af///wH///8B////Af///wH///8BAAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//w=='
                menu.AddItem('Dabblet', link, link, icon, true)
            }

            // Bl.ocks
            if (document.querySelector('.file .file-actions a[href$="index.html" i], .file .file-actions a[href$="README.md" i]')) {
                const link = data.url.replace('https://gist.github.com/', 'https://bl.ocks.org/')
                const icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC0klEQVQ4jaWTTWhcZRSGn++7f3PnTqaTtrRJp4OVlmkzYbRRSQUJrkQoFEVw5UJQGRcVhO66KAxdihXdCFkWusrSIliIESuFRrASf2slY2xDaZN2Mpm5P3P/vq+LEAIprnyXh8Nzznl5D/xPid2Fq+120Yt7UypJjhzvRVe039tq9MrcrnjvGo69HDiVn8+02yGAuRtwaDhYeCZSp3ScobTCefY4ZBlxd52Tsb4stGZFbS4CLwPI3YDyvyvT9kiZ0uQU2BaDlTsMVjtgW5ROPIftjTDS+Xv663Nn6wBme7ZVDJLi1DBLjhTHzSvWXAdZrxP8eBOR5ux/5TUA+r//xODXW+RphCsNYRm6CGDGZnmhUi2citOEJIsRUmLt2YtoTBL+tkTQuQ1Ck/kh0pJIYYDYWVxuGhvTRbvIsYNHMaWFMLZ81UjciSbm4RpZt4u0JGLbc612AKlOxPOHX+Sx3yXTOYk06V/7ChBopSDP0VpvTQbSsE+YxXrebexrtWeLpiEMvEKJxqEm1T09Ft6qMHF9hdr1b/AqB3AnmximTTKMGEab3B09yPf1t0U6Wp031+8tmkJIsiwlyWIcy6FUq3F15hGFpZc4ff8G1RvfkivNA9dlvv46d8cmmTh6gGwjYLlvTZtCodcGD0Wuc/I8I85TlFYsiXFe+PAi1/68x2o3plEfxwNYXuOvzjrDOMV0CsJ0NrxX529+NyfKaqxZa+I5HqZhI6WgVHBoHKtSC2L+WffpBwlhnGIKgTQNpNyJsvj4s4/eC2z/C7tseForHi6/SeuNkzweREggTDJ++GUVlEYYAiEkvV709C+0Pm3tT/zED9SZ8PTMCaERqDxnmCoW/7iPZRlorQj8hHAQ6qcA2/rg/JczkXTncnvf2FRjnJJrc+vOGlGcMOiFuPnGI1cM3/lPwPZprQuz728mhc+1O+plKkeE/agk/QuXPzl7CeAJlkc5xMckqesAAAAASUVORK5CYII='
                menu.AddItem('Bl.ocks', link, link, icon, true)
            }
        }
    }

    // Init
    addMenu()

    // Pjax
    document.addEventListener('pjax:end', addMenu)

})()
