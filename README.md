# Network as Code

TypeScript SDK for Network as Code

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
