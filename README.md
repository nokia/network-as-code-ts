# Network as Code

This repository contains the TypeScript library for Nokia's Network as Code platform,
allowing Python programs to easily call network APIs to query information or to
manage mobile network elements.

## What is Network as Code?

Network as Code is a network API aggregator platform developed by Nokia to expose
network capabilities of mobile networks to applications. It provides numerous
capabilities ranging from quality-of-service to network-based location services
and analytics.

You can find more information over [at the Nokia home page](https://www.nokia.com/networks/network-as-code/) 
or by going directly to the developer portal: https://developer.networkascode.nokia.io/

## Getting started

You can find a full Getting Started guide on the developer portal: https://developer.networkascode.nokia.io/docs/getting-started

## Documentation and Examples

Full documentation is available on the developer portal: https://developer.networkascode.nokia.io/docs

We also provide some basic usage examples in the [examples](./examples) directory. 

## License

The Network as Code TypeScript SDK is open-source software available under the Apache 2.0 license.

## Development

### Commands

- `npm install` - install project dependencies
- `npm build` - compile the project using `tsc`
- `npm test` - run unit tests against mocks
- `npm run integration` - run integration tests against development APIs

### Architecture

This project is structured into `models`, `api` and `namespaces`
modules. The `models` and `namespaces` modules represent the public
API of the SDK and provide abstractions that allow data to be queried
and modified on the Network as Code platform. The `api` module implements
the communication layer that will actually talk to the NaC web APIs and
handle transmission and receipt of data to and from the platform.

The basic design principle is that functionality should be discoverable
and logically organized. To achieve that, most actions are carried out
through the `NetworkAsCodeClient` object, which provides access to the
namespaces in the `namespaces` module. These namespaces typically provide
ways to query and create different types of data objects in the NaC
platform. The data objects themselves have representations in the `models`
module, and are enriched with methods that operate on the individual
data object.

New features typically require modifications to at least the `models`
and `api` modules. New namespaces are introduced as required, typically
when a new API product is launched. However, the namespaces are intended
to be an organizational tool and as such should be used whenever a concept
falls into a new kind of category and to avoid clutter.

### Development process

This project is developed using principles from Test-Driven Development.
This means that for new bugs fixed and features implemented, there should
be matching test cases written.

Tests split into `tests` which are test cases against mocks and intended
to work offline and without need to actually connect to an external system.
We also have `integration-tests` which use a development version of the APIs
to track compatibility. Both test suites are run in CI/CD and failures are
considered blocking.

Test cases should be added to as part of regular development activity and
old test cases should be kept up-to-date. 

New features and changes to old ones should also be documented as soon
as possible. This means that developers ought to be in contact with the
technical writers whenever a change is introduced. It is also recommended
to add an example or update old examples in the `examples` folder to help
communicate functionality and changes to the documentation writers. If
no technical writer is present then the responsibility of writing documentation 
falls on the developers. Developers also need to be able to provide input
to the technical writers to ensure accurate and high-quality documentation.

The branching strategy is based on a split between new releases and
bug fixes. The main branch should contain functionality that either
has been released or will be released shortly + bug fixes. For
unreleased features a specific release branch for that release will be
used and merged to main on release. This way the main branch can be
kept in sync between GitHub and internal GitLab without worrying about
unreleased content.

The overall workflow for a release content is like so:

1. When new release is started, a release-YY.M branch is created from main
2. All planned features will be created on feature branches and MR'd towards the release branch
3. Bug fixes affecting existing releases will be MR'd towards main branch and release branch rebased on main
4. Bug fix releases can be tagged from main, these bug fixes should also be pushed to GitHub
5. Once release content is ready, the release branch is MR'd to main
6. Main should be synchronized with GitHub
7. New release is tagged from main

Bug fixes and new features originating from GitHub should follow the same
process, except the GitHub release branch will not contain internal, unfinished
code. This branch should be created when a PR is first created for the
GitHub repository and will be merged with main after step 6. Bug fixes can
be merged directly to main and synchronized with internal GitLab.
