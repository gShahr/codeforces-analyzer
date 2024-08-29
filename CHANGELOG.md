# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2023-10-05
### Added
- Added `getData` function to fetch user status data from Codeforces API.
- Added `getContestData` function to fetch contest data from Codeforces API.
- Added `drawContestChartWithData` function to draw contest chart with fetched data.
- Added `draw` function to initiate data fetching and chart drawing.
- Added `@require` directives to include external scripts from GitHub.

### Changed
- Updated userscript metadata including `@name`, `@namespace`, `@version`, `@description`, `@author`, `@match`, `@icon`, `@grant`, `@require`, `@license`, `@downloadURL`, and `@updateURL`.

## [1.0.0] - 2023-09-30
### Added
- Initial release of the Codeforces Analyzer userscript.
- Basic functionality to analyze problem-solving patterns on Codeforces.