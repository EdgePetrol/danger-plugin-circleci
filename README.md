# danger-plugin-circleci

[![EdgePetrol](https://circleci.com/gh/EdgePetrol/danger-plugin-circleci.svg?style=shield)](https://app.circleci.com/pipelines/github/EdgePetrol/danger-plugin-circleci)
![EdgePetrol](https://github.com/EdgePetrol/coverage/blob/master/danger-plugin-circleci/master/badge.svg)
[![npm version](https://badge.fury.io/js/danger-plugin-circleci.svg)](https://badge.fury.io/js/danger-plugin-circleci)

> Danger plugin that has helpers to circleCI API

## Usage

Install:

```sh
yarn add danger-plugin-circleci --dev
```

Returns the urls for ´lcov-report/index.html´ stored on a specifc branch and a specific buildName

the default values for buildName is `build`.

```js
// dangerfile.js
import circleci from 'danger-plugin-circleci'

getReportUrlsByBranch(branchName, buildName='build')

```
## Changelog

See the GitHub [release history](https://github.com/guiferrpereira/danger-plugin-circleci/releases).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
