// ==UserScript==
// @name        Github Reply Comments
// @namespace   https://github.com/jerone/UserScripts
// @description Easy reply to Github comments
// @author      jerone
// @copyright   2016+, jerone (http://jeroenvanwarmerdam.nl)
// @license     GPL-3.0
// @homepage    https://github.com/jerone/UserScripts/tree/master/Github_Reply_Comments
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Github_Reply_Comments
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Github_Reply_Comments/Github_Reply_Comments.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Github_Reply_Comments/Github_Reply_Comments.user.js
// @supportURL  https://github.com/jerone/UserScripts/issues
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @version     0.1.0
// @icon        https://github.com/fluidicon.png
// @grant       none
// @include     https://github.com/*
// @include     https://gist.github.com/*
// ==/UserScript==

(function() {

    String.format = function(string) {
        var args = Array.prototype.slice.call(arguments, 1, arguments.length);
        return string.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] !== "undefined" ? args[number] : match;
        });
    };

    /*
     * to-markdown - an HTML to Markdown converter
     * Copyright 2011, Dom Christie
     * Licenced under the MIT licence
     * Source: https://github.com/domchristie/to-markdown
     *
     * Code is altered:
     * - Added task list support: https://github.com/domchristie/to-markdown/pull/62
     * - He dependecy is removed
     */
    var toMarkdown = function(string) {

        var ELEMENTS = [{
            patterns: 'p',
            replacement: function(str, attrs, innerHTML) {
                return innerHTML ? '\n\n' + innerHTML + '\n' : '';
            }
        }, {
            patterns: 'br',
            type: 'void',
            replacement: '  \n'
        }, {
            patterns: 'h([1-6])',
            replacement: function(str, hLevel, attrs, innerHTML) {
                var hPrefix = '';
                for (var i = 0; i < hLevel; i++) {
                    hPrefix += '#';
                }
                return '\n\n' + hPrefix + ' ' + innerHTML + '\n';
            }
        }, {
            patterns: 'hr',
            type: 'void',
            replacement: '\n\n* * *\n'
        }, {
            patterns: 'a',
            replacement: function(str, attrs, innerHTML) {
                var href = attrs.match(attrRegExp('href')),
                    title = attrs.match(attrRegExp('title'));
                return href ? '[' + innerHTML + ']' + '(' + href[1] + (title && title[1] ? ' "' + title[1] + '"' : '') + ')' : str;
            }
        }, {
            patterns: ['b', 'strong'],
            replacement: function(str, attrs, innerHTML) {
                return innerHTML ? '**' + innerHTML + '**' : '';
            }
        }, {
            patterns: ['i', 'em'],
            replacement: function(str, attrs, innerHTML) {
                return innerHTML ? '_' + innerHTML + '_' : '';
            }
        }, {
            patterns: 'code',
            replacement: function(str, attrs, innerHTML) {
                return innerHTML ? '`' + innerHTML + '`' : '';
            }
        }, {
            patterns: 'img',
            type: 'void',
            replacement: function(str, attrs) {
                var src = attrs.match(attrRegExp('src')),
                    alt = attrs.match(attrRegExp('alt')),
                    title = attrs.match(attrRegExp('title'));
                return src ? '![' + (alt && alt[1] ? alt[1] : '') + ']' + '(' + src[1] + (title && title[1] ? ' "' + title[1] + '"' : '') + ')' : '';
            }
        }];

        for (var i = 0, len = ELEMENTS.length; i < len; i++) {
            if (typeof ELEMENTS[i].patterns === 'string') {
                string = replaceEls(string, {
                    tag: ELEMENTS[i].patterns,
                    replacement: ELEMENTS[i].replacement,
                    type: ELEMENTS[i].type
                });
            } else {
                for (var j = 0, pLen = ELEMENTS[i].patterns.length; j < pLen; j++) {
                    string = replaceEls(string, {
                        tag: ELEMENTS[i].patterns[j],
                        replacement: ELEMENTS[i].replacement,
                        type: ELEMENTS[i].type
                    });
                }
            }
        }

        function replaceEls(html, elProperties) {
            var pattern = elProperties.type === 'void' ? '<' + elProperties.tag + '\\b([^>]*)\\/?>' : '<' + elProperties.tag + '\\b([^>]*)>([\\s\\S]*?)<\\/' + elProperties.tag + '>',
                regex = new RegExp(pattern, 'gi'),
                markdown = '';
            if (typeof elProperties.replacement === 'string') {
                markdown = html.replace(regex, elProperties.replacement);
            } else {
                markdown = html.replace(regex, function(str, p1, p2, p3) {
                    return elProperties.replacement.call(this, str, p1, p2, p3);
                });
            }
            return markdown;
        }

        function attrRegExp(attr) {
            return new RegExp(attr + '\\s*=\\s*["\']?([^"\']*)["\']?', 'i');
        }

        // Pre code blocks

        string = string.replace(/<pre\b[^>]*>`([\s\S]*?)`<\/pre>/gi, function(str, innerHTML) {
            var text = innerHTML;
            text = text.replace(/^\t+/g, '  '); // convert tabs to spaces (you know it makes sense)
            text = text.replace(/\n/g, '\n    ');
            return '\n\n    ' + text + '\n';
        });

        // Lists

        // Escape numbers that could trigger an ol
        // If there are more than three spaces before the code, it would be in a pre tag
        // Make sure we are escaping the period not matching any character
        string = string.replace(/^(\s{0,3}\d+)\. /g, '$1\\. ');

        // Converts lists that have no child lists (of same type) first, then works its way up
        var noChildrenRegex = /<(ul|ol)\b[^>]*>(?:(?!<ul|<ol)[\s\S])*?<\/\1>/gi;
        while (string.match(noChildrenRegex)) {
            string = string.replace(noChildrenRegex, replaceLists);
        }

        function replaceLists(html) {

            html = html.replace(/<(ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi, function(str, listType, innerHTML) {
                var lis = innerHTML.split('</li>');
                lis.splice(lis.length - 1, 1);

                for (i = 0, len = lis.length; i < len; i++) {
                    if (lis[i]) {
                        var prefix = (listType === 'ol') ? (i + 1) + ".  " : "*   ";
                        lis[i] = lis[i].replace(/\s*<li[^>]*>([\s\S]*)/i, function(str, innerHTML) {
                            innerHTML = innerHTML.replace(/\s*<input[^>]*?(checked[^>]*)?type=['"]?checkbox['"]?[^>]>/, function(inputStr, checked) {
                                return checked ? '[X]' : '[ ]';
                            });
                            innerHTML = innerHTML.replace(/^\s+/, '');
                            innerHTML = innerHTML.replace(/\n\n/g, '\n\n    ');
                            // indent nested lists
                            innerHTML = innerHTML.replace(/\n([ ]*)+(\*|\d+\.) /g, '\n$1    $2 ');
                            return prefix + innerHTML;
                        });
                    }
                    lis[i] = lis[i].replace(/(.) +$/m, '$1');
                }
                return lis.join('\n');
            });

            return '\n\n' + html.replace(/[ \t]+\n|\s+$/g, '');
        }

        // Blockquotes
        var deepest = /<blockquote\b[^>]*>((?:(?!<blockquote)[\s\S])*?)<\/blockquote>/gi;
        while (string.match(deepest)) {
            string = string.replace(deepest, replaceBlockquotes);
        }

        function replaceBlockquotes(html) {
            html = html.replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, function(str, inner) {
                inner = inner.replace(/^\s+|\s+$/g, '');
                inner = cleanUp(inner);
                inner = inner.replace(/^/gm, '> ');
                inner = inner.replace(/^(>([ \t]{2,}>)+)/gm, '> >');
                return inner;
            });
            return html;
        }

        function cleanUp(string) {
            string = string.replace(/^[\t\r\n]+|[\t\r\n]+$/g, ''); // trim leading/trailing whitespace
            string = string.replace(/\n\s+\n/g, '\n\n');
            string = string.replace(/\n{3,}/g, '\n\n'); // limit consecutive linebreaks to 2
            return string;
        }

        return cleanUp(string);
    };

    function getCommentTextarea(replyBtn) {
        var newComment = replyBtn;
        while (newComment && !newComment.classList.contains('js-quote-selection-container')) {
            newComment = newComment.parentNode;
        }
        if (newComment) {
            var lastElementChild = newComment.lastElementChild;
            lastElementChild.classList.add('open');
            newComment = lastElementChild.querySelector(".comment-form-textarea");
        } else {
            newComment = document.querySelector(".timeline-new-comment .comment-form-textarea");
        }
        return newComment;
    }

    function addReplyButtons() {
        Array.prototype.forEach.call(document.querySelectorAll(".comment"), function(comment) {
            var oldReply = comment.querySelector(".GithubReplyComments, .GithubCommentEnhancerReply");
            if (oldReply) {
                oldReply.parentNode.removeChild(oldReply);
            }

            var header = comment.querySelector(".timeline-comment-header"),
                actions = comment.querySelector(".timeline-comment-actions");

            if (!header) {
                return;
            }
            if (!actions) {
                actions = document.createElement("div");
                actions.classList.add("timeline-comment-actions");
                header.insertBefore(actions, header.firstElementChild);
            }

            var reply = document.createElement("button");
            reply.setAttribute("type", "button");
            reply.setAttribute("title", "Reply to this comment");
            reply.setAttribute("aria-label", "Reply to this comment");
            reply.classList.add("GithubReplyComments", "btn-link", "timeline-comment-action", "tooltipped", "tooltipped-ne");
            reply.addEventListener("click", function(e) {
                e.preventDefault();

                var newComment = getCommentTextarea(this);

                var timestamp = comment.querySelector(".timestamp");

                var commentText = comment.querySelector(".comment-form-textarea");
                if (commentText) {
                    commentText = commentText.value;
                } else {
                    commentText = toMarkdown(comment.querySelector(".comment-body").innerHTML);
                }
                commentText = commentText.trim().split("\n").map(function(line) {
                    return "> " + line;
                }).join("\n");

                var text = newComment.value.length > 0 ? "\n" : "";
                text += String.format('[**@{0}**]({1}/{0}) commented on [{2}]({3} "{4} - Replied by Github Reply Comments"):\n{5}\n\n',
                    comment.querySelector(".author").textContent,
                    location.origin,
                    timestamp.firstElementChild.getAttribute("title"),
                    timestamp.href,
                    timestamp.firstElementChild.getAttribute("datetime"),
                    commentText);

                newComment.value += text;
                newComment.setSelectionRange(newComment.value.length, newComment.value.length);
                newComment.focus();
            });

            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.classList.add("octicon", "octicon-mail-reply");
            svg.setAttribute("height", "16");
            svg.setAttribute("width", "16");
            reply.appendChild(svg);
            var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M6 2.5l-6 4.5 6 4.5v-3c1.73 0 5.14 0.95 6 4.38 0-4.55-3.06-7.05-6-7.38v-3z");
            svg.appendChild(path);

            actions.appendChild(reply);
        });
    }

    // init;
    addReplyButtons();

    // on pjax;
    document.addEventListener('pjax:end', addReplyButtons);

})();
