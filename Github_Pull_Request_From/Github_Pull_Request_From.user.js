// ==UserScript==
// @name        Github Pull Request From Link
// @namespace   https://github.com/jerone/UserScripts
// @description Make pull request original branch linkable
// @author      jerone
// @homepageUrl https://github.com/jerone/UserScripts
// @include     *://github.com/*/*/pull/*
// @version     1
// @grant       none
// ==/UserScript==
(function () {
    var targetTreeSpan = document.querySelectorAll('span.commit-ref.current-branch.css-truncate.js-selectable-text.expandable') [1];
    var branchTree = targetTreeSpan.textContent.trim();
    var splitTree = branchTree.indexOf(':');
    var urlTree = [
        '//github.com',
        branchTree.substring(0, splitTree),
        document.querySelector('.js-current-repository') .textContent,
        'tree',
        branchTree.substring(splitTree + 1, branchTree.length)
    ].join('/');
    var targetSpanA = document.createElement('a');
    targetSpanA.setAttribute('href', urlTree);
    targetSpanA.innerHTML = targetTreeSpan.innerHTML;
    targetTreeSpan.innerHTML = '';
    targetTreeSpan.appendChild(targetSpanA);
}) ();
