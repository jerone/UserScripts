// ==UserScript==
// @name        Github News Feed Filter
// @namespace   https://github.com/jerone/UserScripts
// @description Add filters for Github homepage news feed items
// @author      jerone
// @copyright   2014+, jerone (http://jeroenvanwarmerdam.nl)
// @license     GNU GPLv3
// @homepage    https://github.com/jerone/UserScripts/tree/master/Github_News_Feed_Filter
// @homepageURL https://github.com/jerone/UserScripts/tree/master/Github_News_Feed_Filter
// @downloadURL https://github.com/jerone/UserScripts/raw/master/Github_News_Feed_Filter/Github_News_Feed_Filter.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/Github_News_Feed_Filter/Github_News_Feed_Filter.user.js
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @icon        https://github.com/fluidicon.png
// @include     https://github.com/
// @include     https://github.com/?*
// @include     https://github.com/orgs/*/dashboard
// @include     https://github.com/orgs/*/dashboard?*
// @include     https://github.com/*tab=activity*
// @version     7.1.0
// @grant       none
// ==/UserScript==

(function() {

	var ICONS = {};
	ICONS["octicon-book"] = "M2 5h4v1H2v-1z m0 3h4v-1H2v1z m0 2h4v-1H2v1z m11-5H9v1h4v-1z m0 2H9v1h4v-1z m0 2H9v1h4v-1z m2-6v9c0 0.55-0.45 1-1 1H8.5l-1 1-1-1H1c-0.55 0-1-0.45-1-1V3c0-0.55 0.45-1 1-1h5.5l1 1 1-1h5.5c0.55 0 1 0.45 1 1z m-8 0.5l-0.5-0.5H1v9h6V3.5z m7-0.5H8.5l-0.5 0.5v8.5h6V3z";
	ICONS["octicon-comment-discussion"] = "M15 2H6c-0.55 0-1 0.45-1 1v2H1c-0.55 0-1 0.45-1 1v6c0 0.55 0.45 1 1 1h1v3l3-3h4c0.55 0 1-0.45 1-1V10h1l3 3V10h1c0.55 0 1-0.45 1-1V3c0-0.55-0.45-1-1-1zM9 12H4.5l-1.5 1.5v-1.5H1V6h4v3c0 0.55 0.45 1 1 1h3v2z m6-3H13v1.5l-1.5-1.5H6V3h9v6z";
	ICONS["octicon-gist"] = "M7.5 5l2.5 2.5-2.5 2.5-0.75-0.75 1.75-1.75-1.75-1.75 0.75-0.75z m-3 0L2 7.5l2.5 2.5 0.75-0.75-1.75-1.75 1.75-1.75-0.75-0.75zM0 13V2c0-0.55 0.45-1 1-1h10c0.55 0 1 0.45 1 1v11c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1z m1 0h10V2H1v11z";
	ICONS["octicon-gist-new"] = ICONS["octicon-plus"] = "M12 9H7v5H5V9H0V7h5V2h2v5h5v2z";
	ICONS["octicon-git-branch"] = "M10 5c0-1.11-0.89-2-2-2s-2 0.89-2 2c0 0.73 0.41 1.38 1 1.72v0.3c-0.02 0.52-0.23 0.98-0.63 1.38s-0.86 0.61-1.38 0.63c-0.83 0.02-1.48 0.16-2 0.45V4.72c0.59-0.34 1-0.98 1-1.72 0-1.11-0.89-2-2-2S0 1.89 0 3c0 0.73 0.41 1.38 1 1.72v6.56C0.41 11.63 0 12.27 0 13c0 1.11 0.89 2 2 2s2-0.89 2-2c0-0.53-0.2-1-0.53-1.36 0.09-0.06 0.48-0.41 0.59-0.47 0.25-0.11 0.56-0.17 0.94-0.17 1.05-0.05 1.95-0.45 2.75-1.25s1.2-1.98 1.25-3.02h-0.02c0.61-0.36 1.02-1 1.02-1.73zM2 1.8c0.66 0 1.2 0.55 1.2 1.2s-0.55 1.2-1.2 1.2-1.2-0.55-1.2-1.2 0.55-1.2 1.2-1.2z m0 12.41c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2z m6-8c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2z";
	ICONS["octicon-git-branch-create"] = ICONS["octicon-git-branch"];
	ICONS["octicon-git-branch-delete"] = ICONS["octicon-git-branch"];
	ICONS["octicon-git-commit"] = "M10.86 7c-0.45-1.72-2-3-3.86-3s-3.41 1.28-3.86 3H0v2h3.14c0.45 1.72 2 3 3.86 3s3.41-1.28 3.86-3h3.14V7H10.86zM7 10.2c-1.22 0-2.2-0.98-2.2-2.2s0.98-2.2 2.2-2.2 2.2 0.98 2.2 2.2-0.98 2.2-2.2 2.2z";
	ICONS["octicon-git-merge"] = "M10 7c-0.73 0-1.38 0.41-1.73 1.02v-0.02c-1.05-0.02-2.27-0.36-3.13-1.02-0.75-0.58-1.5-1.61-1.89-2.44 0.45-0.36 0.75-0.92 0.75-1.55 0-1.11-0.89-2-2-2S0 1.89 0 3c0 0.73 0.41 1.38 1 1.72v6.56C0.41 11.63 0 12.27 0 13c0 1.11 0.89 2 2 2s2-0.89 2-2c0-0.73-0.41-1.38-1-1.72V7.67c0.67 0.7 1.44 1.27 2.3 1.69s2.03 0.63 2.97 0.64v-0.02c0.36 0.61 1 1.02 1.73 1.02 1.11 0 2-0.89 2-2s-0.89-2-2-2zM3.2 13c0 0.66-0.55 1.2-1.2 1.2s-1.2-0.55-1.2-1.2 0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2z m-1.2-8.8c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2z m8 6c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2z";
	ICONS["octicon-git-pull-request"] = "M11 11.28c0-1.73 0-6.28 0-6.28-0.03-0.78-0.34-1.47-0.94-2.06s-1.28-0.91-2.06-0.94c0 0-1.02 0-1 0V0L4 3l3 3V4h1c0.27 0.02 0.48 0.11 0.69 0.31s0.3 0.42 0.31 0.69v6.28c-0.59 0.34-1 0.98-1 1.72 0 1.11 0.89 2 2 2s2-0.89 2-2c0-0.73-0.41-1.38-1-1.72z m-1 2.92c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2zM4 3c0-1.11-0.89-2-2-2S0 1.89 0 3c0 0.73 0.41 1.38 1 1.72 0 1.55 0 5.56 0 6.56-0.59 0.34-1 0.98-1 1.72 0 1.11 0.89 2 2 2s2-0.89 2-2c0-0.73-0.41-1.38-1-1.72V4.72c0.59-0.34 1-0.98 1-1.72z m-0.8 10c0 0.66-0.55 1.2-1.2 1.2s-1.2-0.55-1.2-1.2 0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2z m-1.2-8.8c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2z";
	ICONS["octicon-git-pull-request-abandoned"] = ICONS["octicon-git-pull-request"];
	ICONS["octicon-home"] = "M16 9L13 6V2H11v2L8 1 0 9h2l1 5c0 0.55 0.45 1 1 1h8c0.55 0 1-0.45 1-1l1-5h2zM12 14H9V10H7v4H4l-1.19-6.31 5.19-5.19 5.19 5.19-1.19 6.31z";
	ICONS["octicon-issue-closed"] = "M7 10h2v2H7V10z m2-6H7v5h2V4z m1.5 1.5l-1 1 2.5 2.5 4-4.5-1-1-3 3.5-1.5-1.5zM8 13.7c-3.14 0-5.7-2.56-5.7-5.7s2.56-5.7 5.7-5.7c1.83 0 3.45 0.88 4.5 2.2l0.92-0.92C12.14 2 10.19 1 8 1 4.14 1 1 4.14 1 8s3.14 7 7 7 7-3.14 7-7l-1.52 1.52c-0.66 2.41-2.86 4.19-5.48 4.19z";
	ICONS["octicon-issue-opened"] = "M7 2.3c3.14 0 5.7 2.56 5.7 5.7S10.14 13.7 7 13.7 1.3 11.14 1.3 8s2.56-5.7 5.7-5.7m0-1.3C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7S10.86 1 7 1z m1 3H6v5h2V4z m0 6H6v2h2V10z";
	ICONS["octicon-issue-reopened"] = "M8 9H6V4h2v5zM6 12h2V10H6v2z m6.33-2H10l1.5 1.5c-1.05 1.33-2.67 2.2-4.5 2.2-3.14 0-5.7-2.56-5.7-5.7 0-0.34 0.03-0.67 0.09-1H0.08c-0.05 0.33-0.08 0.66-0.08 1 0 3.86 3.14 7 7 7 2.19 0 4.13-1.02 5.41-2.59l1.59 1.59V10H12.33zM1.67 6h2.33l-1.5-1.5c1.05-1.33 2.67-2.2 4.5-2.2 3.14 0 5.7 2.56 5.7 5.7 0 0.34-0.03 0.67-0.09 1h1.31c0.05-0.33 0.08-0.66 0.08-1 0-3.86-3.14-7-7-7-2.19 0-4.13 1.02-5.41 2.59L0 2v4h1.67z";
	ICONS["octicon-person"] = "M7 6H1c-0.55 0-1 0.45-1 1v5h2v3c0 0.55 0.45 1 1 1h2c0.55 0 1-0.45 1-1V12h2V7c0-0.55-0.45-1-1-1z m0 5h-1V9h-1v6H3V9h-1v2H1V7h6v4z m0-8C7 1.34 5.66 0 4 0S1 1.34 1 3s1.34 3 3 3 3-1.34 3-3zM4 5c-1.11 0-2-0.89-2-2S2.89 1 4 1s2 0.89 2 2-0.89 2-2 2z";
	ICONS["octicon-person-add"] = ICONS["octicon-person"];
	ICONS["octicon-plus"] = "M12 9H7v5H5V9H0V7h5V2h2v5h5v2z";
	ICONS["octicon-radio-tower"] = "M4.79 6.11c0.25-0.25 0.25-0.67 0-0.92-0.32-0.33-0.48-0.76-0.48-1.19 0-0.43 0.16-0.86 0.48-1.19 0.25-0.26 0.25-0.67 0-0.92-0.12-0.13-0.29-0.19-0.45-0.19-0.16 0-0.33 0.06-0.45 0.19-0.57 0.58-0.85 1.35-0.85 2.11 0 0.76 0.29 1.53 0.85 2.11C4.14 6.36 4.55 6.36 4.79 6.11zM2.33 0.52c-0.13-0.13-0.29-0.19-0.46-0.19-0.16 0-0.33 0.06-0.46 0.19C0.48 1.48 0.01 2.74 0.01 3.99 0.01 5.25 0.48 6.51 1.41 7.47c0.25 0.26 0.66 0.26 0.91 0 0.25-0.26 0.25-0.68 0-0.94-0.68-0.7-1.02-1.62-1.02-2.54s0.34-1.84 1.02-2.54C2.58 1.2 2.58 0.78 2.33 0.52zM8.02 5.62c0.9 0 1.62-0.73 1.62-1.62 0-0.9-0.73-1.62-1.62-1.62-0.9 0-1.62 0.73-1.62 1.62C6.39 4.89 7.12 5.62 8.02 5.62zM14.59 0.53c-0.25-0.26-0.66-0.26-0.91 0-0.25 0.26-0.25 0.68 0 0.94 0.68 0.7 1.02 1.62 1.02 2.54 0 0.92-0.34 1.83-1.02 2.54-0.25 0.26-0.25 0.68 0 0.94 0.13 0.13 0.29 0.19 0.46 0.19 0.16 0 0.33-0.06 0.46-0.19 0.93-0.96 1.4-2.22 1.4-3.48C15.99 2.75 15.52 1.49 14.59 0.53zM8.02 6.92L8.02 6.92c-0.41 0-0.83-0.1-1.2-0.3L3.67 14.99h1.49l0.86-1h4l0.84 1h1.49L9.21 6.62C8.83 6.82 8.43 6.92 8.02 6.92zM8.01 7.4L9.02 11H7.02L8.01 7.4zM6.02 12.99l1-1h2l1 1H6.02zM11.21 1.89c-0.25 0.25-0.25 0.67 0 0.92 0.32 0.33 0.48 0.76 0.48 1.19 0 0.43-0.16 0.86-0.48 1.19-0.25 0.26-0.25 0.67 0 0.92 0.12 0.13 0.29 0.19 0.45 0.19 0.16 0 0.32-0.06 0.45-0.19 0.57-0.58 0.85-1.35 0.85-2.11 0-0.76-0.28-1.53-0.85-2.11C11.86 1.64 11.45 1.64 11.21 1.89z";
	ICONS["octicon-repo"] = "M4 9h-1v-1h1v1z m0-3h-1v1h1v-1z m0-2h-1v1h1v-1z m0-2h-1v1h1v-1z m8-1v12c0 0.55-0.45 1-1 1H6v2l-1.5-1.5-1.5 1.5V14H1c-0.55 0-1-0.45-1-1V1C0 0.45 0.45 0 1 0h10c0.55 0 1 0.45 1 1z m-1 10H1v2h2v-1h3v1h5V11z m0-10H2v9h9V1z";
	ICONS["octicon-repo-clone"] = "M15 0H9v7c0 0.55 0.45 1 1 1h1v1h1v-1h3c0.55 0 1-0.45 1-1V1c0-0.55-0.45-1-1-1zM11 7h-1v-1h1v1z m4 0H12v-1h3v1z m0-2H11V1h4v4z m-11 0h-1v-1h1v1z m0-2h-1v-1h1v1zM2 1h6V0H1C0.45 0 0 0.45 0 1v12c0 0.55 0.45 1 1 1h2v2l1.5-1.5 1.5 1.5V14h5c0.55 0 1-0.45 1-1V10H2V1z m9 10v2H6v-1H3v1H1V11h10zM3 8h1v1h-1v-1z m1-1h-1v-1h1v1z";
	ICONS["octicon-repo-create"] = ICONS["octicon-plus"];
	ICONS["octicon-repo-push"] = "M4 3h-1v-1h1v1z m-1 2h1v-1h-1v1z m4 0L4 9h2v7h2V9h2L7 5zM11 0H1C0.45 0 0 0.45 0 1v12c0 0.55 0.45 1 1 1h4v-1H1V11h4v-1H2V1h9.02l-0.02 9H9v1h2v2H9v1h2c0.55 0 1-0.45 1-1V1c0-0.55-0.45-1-1-1z";
	ICONS["octicon-repo-forked"] = "M8 1c-1.11 0-2 0.89-2 2 0 0.73 0.41 1.38 1 1.72v1.28L5 8 3 6v-1.28c0.59-0.34 1-0.98 1-1.72 0-1.11-0.89-2-2-2S0 1.89 0 3c0 0.73 0.41 1.38 1 1.72v1.78l3 3v1.78c-0.59 0.34-1 0.98-1 1.72 0 1.11 0.89 2 2 2s2-0.89 2-2c0-0.73-0.41-1.38-1-1.72V9.5l3-3V4.72c0.59-0.34 1-0.98 1-1.72 0-1.11-0.89-2-2-2zM2 4.2c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2z m3 10c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2z m3-10c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2z";
	ICONS["octicon-repo-delete"] = ICONS["octicon-repo"];
	ICONS["octicon-repo-pull"] = "M13 8V6H7V4h6V2l3 3-3 3zM4 2h-1v1h1v-1z m7 5h1v6c0 0.55-0.45 1-1 1H6v2l-1.5-1.5-1.5 1.5V14H1c-0.55 0-1-0.45-1-1V1C0 0.45 0.45 0 1 0h10c0.55 0 1 0.45 1 1v2h-1V1H2v9h9V7z m0 4H1v2h2v-1h3v1h5V11zM4 6h-1v1h1v-1z m0-2h-1v1h1v-1z m-1 5h1v-1h-1v1z";
	ICONS["octicon-star"] = "M14 6l-4.9-0.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14l4.33-2.33 4.33 2.33L10.4 9.26 14 6z";
	ICONS["octicon-tag"] = "M6.73 2.73c-0.47-0.47-1.11-0.73-1.77-0.73H2.5C1.13 2 0 3.13 0 4.5v2.47c0 0.66 0.27 1.3 0.73 1.77l6.06 6.06c0.39 0.39 1.02 0.39 1.41 0l4.59-4.59c0.39-0.39 0.39-1.02 0-1.41L6.73 2.73zM1.38 8.09c-0.31-0.3-0.47-0.7-0.47-1.13V4.5c0-0.88 0.72-1.59 1.59-1.59h2.47c0.42 0 0.83 0.16 1.13 0.47l6.14 6.13-4.73 4.73L1.38 8.09z m0.63-4.09h2v2H2V4z";
	ICONS["octicon-tag-add"] = ICONS["octicon-tag"];
	ICONS["octicon-tag-remove"] = ICONS["octicon-tag"];
	ICONS["octicon-triangle-left"] = "M6 2L0 8l6 6V2z";

	var ACTIONS = [
		{ id: "*-action", text: "All news feed", icon: "octicon-radio-tower", classNames: ["*-action"] },
		{
			id: "issues", text: "Issues", icon: "octicon-issue-opened", classNames: ["issues_opened", "issues_closed", "issues_reopened", "issues_comment"], subFilters: [
				{ id: "issues opened", text: "Opened", icon: "octicon-issue-opened", classNames: ["issues_opened"] },
				{ id: "issues closed", text: "Closed", icon: "octicon-issue-closed", classNames: ["issues_closed"] },
				{ id: "issues reopened", text: "Reopened", icon: "octicon-issue-reopened", classNames: ["issues_reopened"] },
				{ id: "issues comments", text: "Comments", icon: "octicon-comment-discussion", classNames: ["issues_comment"] }
			]
		},
		{
			id: "commits", text: "Commits", icon: "octicon-git-commit", classNames: ["push", "commit_comment"], subFilters: [
				{ id: "commits pushed", text: "Pushed", icon: "octicon-git-commit", classNames: ["push"] },
				{ id: "commits comments", text: "Comments", icon: "octicon-comment-discussion", classNames: ["commit_comment"] }
			]
		},
		{
			id: "pr", text: "Pull Requests", icon: "octicon-git-pull-request", classNames: ["pull_request_opened", "pull_request_closed", "pull_request_merged", "pull_request_comment"], subFilters: [
				{ id: "pr opened", text: "Opened", icon: "octicon-git-pull-request", classNames: ["pull_request_opened"] },
				{ id: "pr closed", text: "Closed", icon: "octicon-git-pull-request-abandoned", classNames: ["pull_request_closed"] },
				{ id: "pr merged", text: "Merged", icon: "octicon-git-merge", classNames: ["pull_request_merged"] },
				{ id: "pr comments", text: "Comments", icon: "octicon-comment-discussion", classNames: ["pull_request_comment"] }
			]
		},
		{
			id: "repo", text: "Repo", icon: "octicon-repo", classNames: ["create", "public", "fork", "branch_create", "branch_delete", "tag_add", "tag_remove", "release", "delete"], subFilters: [
				{ id: "repo created", text: "Created", icon: "octicon-repo-create", classNames: ["create"] },
				{ id: "repo public", text: "Public", icon: "octicon-repo-push", classNames: ["public"] },
				{ id: "repo forked", text: "Forked", icon: "octicon-repo-forked", classNames: ["fork"] },
				{ id: "repo deleted", text: "Deleted", icon: "octicon-repo-delete", classNames: ["delete"] },
				{ id: "repo released", text: "Release", icon: "octicon-repo-pull", classNames: ["release"] },
				{
					id: "repo branched", text: "Branch", icon: "octicon-git-branch", classNames: ["branch_create", "branch_delete"], subFilters: [
						{ id: "repo branch created", text: "Created", icon: "octicon-git-branch-create", classNames: ["branch_create"] },
						{ id: "repo branch deleted", text: "Deleted", icon: "octicon-git-branch-delete", classNames: ["branch_delete"] }
					]
				},
				{
					id: "repo tagged", text: "Tag", icon: "octicon-tag", classNames: ["tag_add", "tag_remove"], subFilters: [
						{ id: "repo tag added", text: "Added", icon: "octicon-tag-add", classNames: ["tag_add"] },
						{ id: "repo tag removed", text: "Removed", icon: "octicon-tag-remove", classNames: ["tag_remove"] }
					]
				}
			]
		},
		{
			id: "user", text: "User", icon: "octicon-person", classNames: ["watch_started", "member_add", "team_add"], subFilters: [
				{ id: "user starred", text: "Starred", icon: "octicon-star", classNames: ["watch_started"] },
				{ id: "user added", text: "Member added", icon: "octicon-person-add", classNames: ["member_add", "team_add"] }
			]
		},
		{
			id: "wiki", text: "Wiki", icon: "octicon-book", classNames: ["wiki_created", "wiki_edited"], subFilters: [
				{ id: "wiki created", text: "Created", icon: "octicon-plus", classNames: ["wiki_created"] },
				{ id: "wiki edited", text: "Edited", icon: "octicon-book", classNames: ["wiki_edited"] }
			]
		},
		{
			id: "gist", text: "Gist", icon: "octicon-gist", classNames: ["gist_created", "gist_updated"], subFilters: [
				{ id: "gist created", text: "Created", icon: "octicon-gist-new", classNames: ["gist_created"] },
				{ id: "gist updated", text: "Updated", icon: "octicon-gist", classNames: ["gist_updated"] }
			]
		}
	];

	var REPOS = [];

	var USERS = [];

	var datasetId = "githubNewsFeedFilter";
	var datasetIdLong = "data-github-news-feed-filter";
	var filterElement = "github-news-feed-filter";
	var filterListElement = "github-news-feed-filter-list";

	function proxy(fn) {
		return function() {
			var that = this;
			return function(e) {
				var args = that.slice(0); // clone;
				args.unshift(e); // prepend event;
				fn.apply(this, args);
			};
		}.call([].slice.call(arguments, 1));
	}

	function addStyle(css) {
		var node = document.createElement("style");
		node.type = "text/css";
		node.appendChild(document.createTextNode(css));
		document.head.appendChild(node);
	}

	addStyle("\
		github-news-feed-filter { display: block; }\
		github-news-feed-filter .count { margin-right: 15px; }\
		\
		/* Needed for user?tab=activity; */\
		.profilecols github-news-feed-filter .filter-bar { padding: 10px 10px 0px 10px; }\
		.profilecols github-news-feed-filter .filter-bar .repo-filterer li { float: none; }\
		\
		github-news-feed-filter .filter-list .mini-repo-list-item { padding-right: 64px; }\
		\
		github-news-feed-filter .filter-list .filter-list .mini-repo-list-item { padding-left: 40px; border-top: 1px dashed #E5E5E5; }\
		github-news-feed-filter .filter-list .filter-list .filter-list .mini-repo-list-item { padding-left: 50px; }\
		\
		github-news-feed-filter .filter-list { display: none; }\
		github-news-feed-filter .open > .filter-list { display: block; }\
		github-news-feed-filter .filter-list.open { display: block; }\
		\
		github-news-feed-filter .private { font-weight: bold; }\
		\
		github-news-feed-filter .stars .octicon { position: absolute; right: -4px; }\
		github-news-feed-filter .filter-list-item.open > a > .stars > .octicon { transform: rotate(-90deg); }\
		\
		.no-alerts { font-style: italic; }\
	");

	// Add filter menu list;
	function addFilterMenu(type, filters, parent, newsContainer, filterContainer, main) {
		var ul = document.createElement("ul");
		ul.classList.add("filter-list");
		if (main) {
			ul.classList.add("mini-repo-list");
		}
		parent.appendChild(ul);

		filters.forEach(function(subFilter) {
			var li = addFilterMenuItem(type, subFilter, ul, newsContainer, filterContainer);

			if (subFilter.subFilters) {
				addFilterMenu(type, subFilter.subFilters, li, newsContainer, filterContainer, false);
			}
		});
	}

	// Add filter menu item;
	function addFilterMenuItem(type, filter, parent, newsContainer, filterContainer) {
		// Filter item;
		var li = document.createElement("li");
		li.classList.add("filter-list-item");
		li.filterClassNames = filter.classNames;
		parent.appendChild(li);

		// Filter link;
		var a = document.createElement("a");
		a.classList.add("mini-repo-list-item", "css-truncate");
		a.setAttribute("href", filter.link || "/");
		a.setAttribute("title", filter.classNames.join(" & "));
		a.dataset[datasetId] = filter.id;
		a.addEventListener("click", proxy(onFilterItemClick, type, newsContainer, filterContainer));
		li.appendChild(a);

		// Filter icon;
		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.classList.add("repo-icon", "octicon", filter.icon);
		svg.setAttribute("height", "16");
		svg.setAttribute("width", "16");
		a.appendChild(svg);
		var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttribute("d", ICONS[filter.icon]);
		svg.appendChild(path);

		// Filter text;
		var text = filter.text.split("/");
		var t = document.createElement("span");
		t.classList.add("repo-and-owner", "css-truncate-target");
		a.appendChild(t);
		var to = document.createElement("span");
		to.classList.add("owner");
		to.appendChild(document.createTextNode(text[0]));
		t.appendChild(to);
		if (text.length > 1) {
			text.shift();
			t.appendChild(document.createTextNode("/"));
			var tr = document.createElement("span");
			tr.classList.add("repo");
			tr.appendChild(document.createTextNode(text.join("/")));
			t.appendChild(tr);
		}

		// Filter count & sub list arrow;
		var s = document.createElement("span");
		s.classList.add("stars");
		var c = document.createElement("span");
		c.classList.add("count");
		c.appendChild(document.createTextNode("0"));
		s.appendChild(c);
		if (filter.subFilters) {
			s.appendChild(document.createTextNode(" "));
			var osvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			osvg.classList.add("octicon", "octicon-triangle-left");
			osvg.setAttribute("height", "16");
			osvg.setAttribute("width", "6");
			s.appendChild(osvg);
			var opath = document.createElementNS("http://www.w3.org/2000/svg", "path");
			opath.setAttribute("d", ICONS["octicon-triangle-left"]);
			osvg.appendChild(opath);
		}
		a.appendChild(s);

		return li;
	}

	// Filter item click event;
	function onFilterItemClick(e, type, newsContainer, filterContainer) {
		e.preventDefault();

		// Store current filter;
		setCurrentFilter(type, this.dataset[datasetId]);

		// Open/close sub list;
		Array.forEach(filterContainer.querySelectorAll(".open"), function(item) { item.classList.remove("open"); });
		showParentMenu(this);
		this.parentNode.classList.add("open");

		// Give it a colored background;
		Array.forEach(filterContainer.querySelectorAll(".private"), function(m) { m.classList.remove("private"); });
		this.parentNode.classList.add("private");

		// Toggle alert visibility;
		toggleAlertsVisibility(newsContainer);
	}

	// Toggle alert visibility;
	function toggleAlertsVisibility(newsContainer) {
		// Get selected filters;
		var anyVisibleAlert = false;
		var classNames = [];
		var selected = document.querySelectorAll(filterElement + " .private");
		if (selected.length > 0) {
			Array.prototype.forEach.call(selected, function(item) {
				classNames.push(item.filterClassNames);
			});
		}

		// Show/hide alerts;
		if (classNames.length === 0 || classNames.every(function(cl) { return cl.every(function(c) { return !!~c.indexOf("*"); }); })) {
			anyVisibleAlert = true;
			Array.forEach(newsContainer.querySelectorAll(".alert"), function(alert) {
				alert.style.display = "block";
			});
		} else {
			Array.forEach(newsContainer.querySelectorAll(".alert"), function(alert) {
				var show = classNames.every(function(cl) { return cl.some(function(c) { return !!~c.indexOf("*") || alert.classList.contains(c); }); });
				anyVisibleAlert = show || anyVisibleAlert;
				alert.style.display = show ? "block" : "none";
			});
		}

		// Show/hide message about no alerts;
		var none = newsContainer.querySelector(".no-alerts");
		if (anyVisibleAlert && none) {
			none.parentNode.removeChild(none);
		} else if (!anyVisibleAlert && !none) {
			none = document.createElement("div");
			none.classList.add("no-alerts", "protip");
			none.appendChild(document.createTextNode("No feed items for this filter. Please select another filter."));
			newsContainer.insertBefore(none, newsContainer.firstElementChild.nextElementSibling);
		}
	}

	// Traverse back up the tree to open sub lists;
	function showParentMenu(menuItem) {
		var parentMenuItem = menuItem.parentNode;
		if (parentMenuItem.classList.contains("filter-list-item")) {
			parentMenuItem.classList.add("open");
			showParentMenu(parentMenuItem.parentNode);
		}
	}

	// Fix filter action identification;
	function fixActionAlerts(newsContainer) {
		Array.forEach(newsContainer.querySelectorAll(".alert"), function(alert) {
			if (!!~alert.querySelector('.title').textContent.indexOf('created branch')) {
				alert.classList.remove("create");
				alert.classList.add("branch_create");
			} else if (!!~alert.querySelector('.title').textContent.indexOf('deleted branch')) {
				alert.classList.remove("delete");
				alert.classList.add("branch_delete");
			} else if (alert.getElementsByClassName("octicon-tag").length > 0 && !alert.classList.contains("release")) {
				alert.classList.remove("create");
				alert.classList.add("tag_add");
			} else if (alert.getElementsByClassName("octicon-tag-remove").length > 0) {
				alert.classList.remove("delete");
				alert.classList.add("tag_remove");
			} else if (alert.getElementsByClassName("octicon-git-pull-request").length > 0) {
				if (alert.classList.contains("issues_opened")) {
					alert.classList.remove("issues_opened");
					alert.classList.add("pull_request_opened");
				} else if (alert.classList.contains("issues_closed")) {
					alert.classList.remove("issues_closed");
					if (!!~alert.querySelector('.title').textContent.indexOf('merged pull request')) {
						alert.classList.add("pull_request_merged");
					} else {
						alert.classList.add("pull_request_closed");
					}
				}
			} else if (alert.classList.contains("issues_comment") && alert.querySelectorAll(".title a")[1].href.split("/")[5] === "pull") {
				alert.classList.remove("issues_comment");
				alert.classList.add("pull_request_comment");
			} else if (alert.classList.contains("gollum")) {
				alert.classList.remove("gollum");
				if (!!~alert.querySelector('.title').textContent.indexOf(" created the ")) {
					alert.classList.add("wiki_created");
				} else if (!!~alert.querySelector('.title').textContent.indexOf(" edited the ")) {
					alert.classList.add("wiki_edited");
				}
			} else if (alert.classList.contains("gist")) {
				alert.classList.remove("gist");
				alert.classList.add("gist_" + alert.querySelector(".title span").textContent);
			}
		});
	}
	// Fix filter repo identification;
	function fixRepoAlerts(newsContainer) {
		REPOS = [{ id: "*-repo", text: "All repositories", icon: "octicon-repo", classNames: ["*-repo"] }];

		// Get unique list of repos;
		var userRepos = new Set();
		Array.prototype.forEach.call(newsContainer.querySelectorAll(".alert"), function(alert) {
			var links = alert.querySelectorAll(".title a");
			var userRepo = links[links.length - 1].textContent.split("#")[0]; // Remove issue number from text;
			userRepos.add(userRepo);
			var repo = userRepo.split("/")[1];
			alert.classList.add(repo, userRepo);
		});

		// Get list of user repos (forks) per repo names;
		var repos = {};
		userRepos.forEach(function(userRepo) {
			var repo = userRepo.split("/")[1];
			if (!repos[repo]) {
				repos[repo] = [];
			}
			repos[repo].push(userRepo);
		});

		// Populate global property;
		Object.keys(repos).forEach(function(repo) {
			if (repos[repo].length === 1) {
				var userRepo = repos[repo][0];
				REPOS.push({ id: userRepo, text: userRepo, link: userRepo, icon: "octicon-repo", classNames: [userRepo] });
			} else {
				var repoForks = { id: repo, text: repo, icon: "octicon-repo-clone", classNames: [repo], subFilters: [] };
				repos[repo].forEach(function(userRepo) {
					repoForks.classNames.push(userRepo);
					repoForks.subFilters.push({ id: userRepo, text: userRepo, link: userRepo, icon: "octicon-repo", classNames: [userRepo] });
				});
				REPOS.push(repoForks);
			}
		});
	}
	// Fix filter user identification;
	function fixUserAlerts(newsContainer) {
		USERS = [{ id: "*-user", text: "All users", icon: "octicon-person", classNames: ["*-user"] }];

		var users = new Set();
		Array.prototype.forEach.call(newsContainer.querySelectorAll(".alert"), function (alert) {
			var links = alert.querySelectorAll(".title a");
			var username = links[0].textContent;
			alert.classList.add(username);
			users.add(username);

			// Add member too.
			if (alert.classList.contains("member_add")) {
				var member = links[1].textContent;
				alert.classList.add(member);
				users.add(member);
			}
		});

		[...users].sort(function (a, b) {
			return a.toLowerCase().localeCompare(b.toLowerCase());
		}).forEach(function(username) {
			var user = { id: username, text: username, icon: "octicon-person", classNames: [username] };
			USERS.push(user);
		});
	}

	// Update filter counts;
	function updateFilterCounts(filterContainer, newsContainer) {
		Array.forEach(filterContainer.querySelectorAll("li.filter-list-item"), function(li) {
			// Count alerts based on other filters;
			var countFiltered = 0;
			var classNames = [li.filterClassNames];
			var selected = document.querySelectorAll(filterElement + " li.filter-list-item.private");
			if (selected.length > 0) {
				Array.prototype.forEach.call(selected, function(item) {
					if (item.parentNode.parentNode !== filterContainer) { // exclude list item from current filter container;
						classNames.push(item.filterClassNames);
					}
				});
			}
			Array.forEach(newsContainer.querySelectorAll(".alert"), function(alert) {
				var show = classNames.every(function(cl) { return cl.some(function(c) { return !!~c.indexOf("*") || alert.classList.contains(c); }); });
				if (show) {
					countFiltered++;
				}
			});

			// Count alerts based on current filter;
			var countAll = 0;
			if (!!~li.filterClassNames[0].indexOf("*")) {
				countAll = newsContainer.querySelectorAll(".alert").length;
			} else {
				Array.forEach(newsContainer.querySelectorAll(".alert"), function(alert) {
					if (li.filterClassNames.some(function(cl) { return alert.classList.contains(cl); })) {
						countAll++;
					}
				});
			}

			li.querySelector(".count").textContent = countAll + " (" + countFiltered + ")";
		});
	}

	var CURRENT = {};

	// Set current filter;
	function setCurrentFilter(type, filter) {
		CURRENT[type] = filter;
	}

	// Get current filter;
	function getCurrentFilter(type, filterContainer) {
		var filter = CURRENT[type] || "*-" + type;
		filterContainer.querySelector('[' + datasetIdLong + '="' + filter + '"]').dispatchEvent(new Event("click"));
	}

	function addFilterTab(type, text, inner, filterer, onCreate, onSelect) {
		var filterTab = document.createElement("li");
		filterer.appendChild(filterTab);
		var filterTabInner = document.createElement("a");
		filterTabInner.setAttribute("href", "#");
		filterTabInner.classList.add("repo-filter", "js-repo-filter-tab");
		filterTabInner.appendChild(document.createTextNode(text));
		filterTab.appendChild(filterTabInner);

		var filterContainer = document.createElement(filterListElement);
		inner.appendChild(filterContainer);

		filterTabInner.addEventListener("click", proxy(filterTabInnerClick, type, inner, filterContainer, onSelect));

		onCreate && onCreate(type, filterContainer);
	}

	// Filter tab click event;
	function filterTabInnerClick(e, type, inner, filterContainer, onSelect) {
		e.preventDefault();

		var selected = inner.querySelector(".filter-selected");
		selected && selected.classList.remove("filter-selected");
		this.classList.add("filter-selected");

		Array.forEach(inner.querySelectorAll(filterListElement), function(menu) {
			menu && menu.classList.remove("open");
		});
		filterContainer.classList.add("open");

		onSelect && onSelect(type, filterContainer);
	}

	// Init;
	(function init() {
		var newsContainer = document.querySelector(".news");
		if (!newsContainer) { return; }

		// GitHub homepage or profile activity tab;
		var sidebar = document.querySelector(".dashboard-sidebar") || document.querySelector(".profilecols > .column:first-child");

		var wrapper = document.createElement(filterElement);
		wrapper.classList.add("boxed-group", "flush", "user-repos");
		sidebar.insertBefore(wrapper, sidebar.firstChild);

		var headerAction = document.createElement("div");
		headerAction.classList.add("boxed-group-action");
		wrapper.appendChild(headerAction);

		var headerLink = document.createElement("a");
		headerLink.setAttribute("href", "https://github.com/jerone/UserScripts");
		headerLink.classList.add("btn", "btn-sm");
		headerAction.appendChild(headerLink);

		var headerLinkSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		headerLinkSvg.classList.add("octicon", "octicon-home");
		headerLinkSvg.setAttribute("height", "16");
		headerLinkSvg.setAttribute("width", "16");
		headerLinkSvg.setAttribute("title", "Open Github News Feed Filter homepage");
		headerLink.appendChild(headerLinkSvg);
		var headerLinkPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
		headerLinkPath.setAttribute("d", ICONS["octicon-home"]);
		headerLinkSvg.appendChild(headerLinkPath);

		var headerText = document.createElement("h3");
		headerText.appendChild(document.createTextNode("News feed filter"));
		wrapper.appendChild(headerText);

		var inner = document.createElement("div");
		inner.classList.add("boxed-group-inner");
		wrapper.appendChild(inner);

		var bar = document.createElement("div");
		bar.classList.add("filter-repos", "filter-bar");
		inner.appendChild(bar);

		var filterer = document.createElement("ul");
		filterer.classList.add("repo-filterer");
		bar.appendChild(filterer);

		// Create filter tabs;
		addFilterTab("action", "Actions", inner, filterer, function onCreateActions(type, filterContainer) {
			// Create filter menu;
			addFilterMenu(type, ACTIONS, filterContainer, newsContainer, filterContainer, true);
		}, function onSelectActions(type, filterContainer) {
			// Fix alert identification;
			fixActionAlerts(newsContainer);
			// Update filter counts;
			updateFilterCounts(filterContainer, newsContainer);
			// Restore current filter;
			getCurrentFilter(type, filterContainer);
		});
		addFilterTab("repo", "Repositories", inner, filterer, function onCreateRepos(type, filterContainer) {
			// Fix filter identification and create repos list;
			fixRepoAlerts(newsContainer);
			// Create filter menu;
			addFilterMenu(type, REPOS, filterContainer, newsContainer, filterContainer, true);
		}, function onSelectRepos(type, filterContainer) {
			// Fix alert identification and create repos list;
			fixRepoAlerts(newsContainer);
			// Empty list, so it can be filled again;
			while (filterContainer.hasChildNodes()) {
				filterContainer.removeChild(filterContainer.lastChild);
			}
			// Create filter menu;
			addFilterMenu(type, REPOS, filterContainer, newsContainer, filterContainer, true);
			// Update filter counts;
			updateFilterCounts(filterContainer, newsContainer);
			// Restore current filter;
			getCurrentFilter(type, filterContainer);
		});
		addFilterTab("user", "Users", inner, filterer, function onCreateUsers(type, filterContainer) {
			// Fix filter identification and create users list;
			fixUserAlerts(newsContainer);
			// Create filter menu;
			addFilterMenu(type, USERS, filterContainer, newsContainer, filterContainer, true);
		}, function onSelectUsers(type, filterContainer) {
			// Fix filter identification and create users list;
			fixUserAlerts(newsContainer);
			// Empty list, so it can be filled again;
			while (filterContainer.hasChildNodes()) {
				filterContainer.removeChild(filterContainer.lastChild);
			}
			// Create filter menu;
			addFilterMenu(type, USERS, filterContainer, newsContainer, filterContainer, true);
			// Update filter counts;
			updateFilterCounts(filterContainer, newsContainer);
			// Restore current filter;
			getCurrentFilter(type, filterContainer);
		});

		// Open first filter tab;
		filterer.querySelector("a").dispatchEvent(new Event("click"));

		// Update on clicking "More"-button;
		new MutationObserver(function() {
			// Re-click the current selected filter on open filter tab;
			filterer.querySelector("a.filter-selected").dispatchEvent(new Event("click"));
		}).observe(newsContainer, { childList: true });
	})();

})();
