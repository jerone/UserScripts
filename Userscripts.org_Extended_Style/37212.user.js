// ==UserScript==
// @name           Userscripts.org Extended Style
// @namespace      http://userscripts.org/scripts/show/37212
// @description    Userscripts.org Extended Style
// @copyright      jerone & Jesse A.
// @include        *userscripts.org*
// @grant          GM_addStyle
// ==/UserScript==

GM_addStyle("												\
															\
	/* script management header link fix */					\
	#home-scripts th a,										\
	#home-scripts th a:active {								\
		color: white !important;							\
	}														\
	#home-scripts th a:hover {								\
		color: #FFDD00 !important;							\
	}														\
															\
	/* script management stretch */							\
	#home-scripts #content .subnav {						\
		margin-right: -150px;								\
		width: 10% !important;								\
	}														\
	#home-scripts #root>.container,							\
	#home-scripts #content {								\
		width: 100% !important;								\
	}														\
	#home-scripts #main {									\
		float: right !important;							\
		padding-right: 10px !important;						\
		width: 87% !important;								\
	}														\
															\
	/* script management table left border */				\
	table tr td.script-meat {								\
		border-left: 1px solid #DDDDDD !important;			\
	}														\
															\
	/* script management stretch Edit/Update column */		\
	.wide.forums th:nth-child(2) {							\
		width: 135px;										\
	}														\
															\
	/* script management dent Last Updated column */		\
	.wide.forums th:nth-last-child(1) {						\
		width: 1% !important;								\
	}														\
															\
	/* script management table more row space */			\
	.wide.forums p {										\
		margin-bottom: 0 !important;						\
	}														\
															\
	/* script management row hover */						\
	.wide.forums tr:hover td {								\
		background-color: AntiqueWhite;						\
	}														\
															\
");



//*** STATISTICS ***//
// Chars (exclude spaces): 1.427
// Chars (include spaces): 2.266
// Chars (Chinese): 0
// Words: 277
// Lines: 80