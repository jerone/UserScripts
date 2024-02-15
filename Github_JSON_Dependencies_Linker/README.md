# [Github JSON Dependencies Linker](https://github.com/jerone/UserScripts/tree/master/Github_JSON_Dependencies_Linker) <sup>(abandoned)</sup>

[![Install](https://raw.github.com/jerone/UserScripts/master/_resources/Install-button.png)](https://github.com/jerone/UserScripts/raw/master/Github_JSON_Dependencies_Linker/Github_JSON_Dependencies_Linker.user.js)
[![Source](https://raw.github.com/jerone/UserScripts/master/_resources/Source-button.png)](https://github.com/jerone/UserScripts/blob/master/Github_JSON_Dependencies_Linker/Github_JSON_Dependencies_Linker.user.js)
[![Donate](https://raw.github.com/jerone/UserScripts/master/_resources/Donate-button.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW)
[![Support](https://raw.github.com/jerone/UserScripts/master/_resources/Support-button.png)](https://github.com/jerone/UserScripts/issues)

## Description

Linkify all dependencies found in an JSON file.

The following JSON schemes are supported:

-   [NPM](https://www.npmjs.com) - `package.json` & `npm-shrinkwrap.json`
-   [Bower](http://bower.io) - `bower.json`
-   [NuGet](https://www.nuget.org) - `project.json`
-   [Atom](https://atom.io) - `package.json`

In the JSON file it will search for the following dependency keys:

-   `dependencies`
-   `devDependencies`
-   `peerDependencies`
-   `bundleDependencies`
-   `bundledDependencies`
-   `packageDependencies`
-   `optionalDependencies`

## Screenshot

![Github JSON Dependencies Linker Screenshot](https://github.com/jerone/UserScripts/raw/master/Github_JSON_Dependencies_Linker/screenshot.jpg)

## Compatible

-   [![Tampermonkey](https://raw.github.com/jerone/UserScripts/master/_resources/Tampermonkey.png) Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/) on [![Mozilla Firefox](https://raw.github.com/jerone/UserScripts/master/_resources/Firefox.png) Mozilla Firefox](http://www.mozilla.org/en-US/firefox/fx/#desktop) desktop.

## Version History

-   **0.3.2**
    -   🐛 Fix broken icon url ([#146](https://github.com/jerone/UserScripts/pull/146)).
-   **0.3.1**
    -   Fixed recognizing JSON content.
-   **0.3.0**
    -   Added support for Atom for `packageDependencies`.
-   **0.2.0**
    -   Module name preceding a colon is never a key.
    -   Added support for npm-shrinkwrap.json.
    -   Fetching module names is now recursive.
-   **0.1.0**
    -   Initial version.

## Test cases

-   <https://github.com/jerone/PackageSize/blob/master/package.json> (multiple package.json dependencies);
-   <https://github.com/npm/npm/tree/07f020a09e94ae393c67526985444e128ef6f83c/test/disabled/bundlerecurs/package.json>
-   <https://github.com/npm/npm/tree/07f020a09e94ae393c67526985444e128ef6f83c/test/packages/npm-test-optional-deps/package.json> (optionalDependencies & different semver);
-   <https://github.com/npm/npm/tree/07f020a09e94ae393c67526985444e128ef6f83c/test/packages/npm-test-bundled-git/package.json> (git semver & bundledDependencies);
-   <https://github.com/npm/npm/tree/07f020a09e94ae393c67526985444e128ef6f83c/test/packages/npm-test-shrinkwrap/npm-shrinkwrap.json> (npm-shrinkwrap.json);
-   <https://github.com/npm/npm/tree/07f020a09e94ae393c67526985444e128ef6f83c/test/packages/npm-test-url-dep/package.json> (url semver);
-   <https://github.com/aspnet/MusicStore/blob/8ce50e3fb34cbfc73537b9cf995fce3608c007fa/samples/MusicStore/project.json> (ASP.NET project.json with COMMENTS);
-   <https://github.com/atom/atom/blob/master/package.json> (Atom package.json packageDependencies atomShellVersion);
-   <https://github.com/suda/toolbar-main/blob/master/package.json> (Atom package.json packageDependencies engines.atom);

## Dependencies

-   Part of [sindresorhus](https://github.com/sindresorhus) module [**strip-json-comments**](https://github.com/sindresorhus/strip-json-comments) is used.

## External links

-   [Greasy Fork](https://greasyfork.org/en/scripts/8770-github-json-dependencies-linker)
-   [OpenUserJS](https://openuserjs.org/scripts/jerone/Github_JSON_Dependencies_Linker)
