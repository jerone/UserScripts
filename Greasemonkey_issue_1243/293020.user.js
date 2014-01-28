// ==UserScript==
// @name           Greasemonkey issue 1243
// @namespace      https://github.com/greasemonkey/greasemonkey/issues/1243
// @description    GM doesn't allow to use localStorage.length
// @include        *
// ==/UserScript==
window.localStorage.setItem('test1', 'test1');
console.log('Getting data (should be "test1"): ', window.localStorage.getItem('test1'));
window.localStorage.setItem('test2', 'test2');
console.log('Total count (should be 2 or higher): ', window.localStorage.length);
