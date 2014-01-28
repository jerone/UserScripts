// ==UserScript==
// @name        Marktplaats Exchanger
// @namespace   http://userscripts.org/users/jerone
// @description Exchange Marktplaats.nl
// @author      jerone
// @homepageURL http://userscripts.org/scripts/show/292931
// @include     *://www.marktplaats.*
// @include     *://marktplaats.*
// @version     1
// @grant       GM_addStyle
// ==/UserScript==



GM_addStyle(''
// remove columns: omhoogplaatsen, dagtopper, topadvertentie; 
+ '.phone-upcall { background-image: none !important; height: auto; margin-bottom: 0; }'
+ '.dagtopper-column, .up-call-column, .top-ad-column { display: none; }'
+ '.ad-listing .description-column { width: auto; }'
// smaller rows;
+ '.ad-listing .thumbnail-wrapper { margin: 5px 10px 5px 0; height: auto; line-height: auto; }'
+ '.ad-listing .listing-status { margin-top: 12px;}'
+ '.ad-listing .price { padding-top: 12px;}'
+ '.ad-listing .price-column { width: 150px;}'
+ '.ad-listing .views-column { width: 50px;}'
// current bid on it's own column;
+ '.ad-listing .highest-bid { margin-top: 4px; float: left; position: relative; }'
+ '.ad-listing .highest-bid a { position: absolute; right: 20px; text-align: right; white-space: nowrap; }'
+ '.item-actions { float: left;}'
);



// ==UserStats==
// Chars (excl. spaces): 1.154
// Chars (incl. spaces): 1.319
// Words: 165
// Lines: 39
// ==/UserStats==