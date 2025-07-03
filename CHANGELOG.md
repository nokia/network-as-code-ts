# Changelog

## Version 5.0.0

Breaking Changes:
- Introduced one main API with all features available as separate endpoints.

Deprications:
- Slice modification endpoint is no longer supported.

## Version 4.2.1

Fixes:
- The docstring in Sim Swap functionality incorrectly stated that `maxAge` was in seconds, when it is in fact in hours

## Version 4.2.0

Changes:
- Introduced support for Geofencing API
- Introduced support for Number Verification API

Fixes:
- Updated mocking libraries to deal with deprecated dependencies

## Version 4.1.1

Fixes:
- Adapted the Location Verification bindings to use the new version prefix

## Version 4.1.0

Changes:
- Made using devices with public IPv4 address a bit easier by allowing private address to be omitted

Fixes:
- Eslint dependency was upgraded and new lints enabled, code changed to satisfy the lints 

## Version 4.0.0

Breaking changes:
- Location verification using `device.verifyLocation()` now returns a `VerificationResult`
  containing fields for `matchRate`, `lastLocationTime` and `resultType`

## Version 3.1.0

Changes:
- Radius information has been added to `device.location()` output
- QoD Sessions can now be extended with `session.extendSession()` method
- Docstrings have been updated across the board

## Version 3.0.1

Fixes:
- QoD webhook was supplied using an older method, this release brings the SDK
  back in line with the newer behavior of the API

## Version 3.0.0

Breaking changes:
- `device.createQodSession()` now requires `duration` as a mandatory parameter
- `device.getCongestion()` now returns a list of `Congestion` objects

Changes:
- `device.verifyLocation()` may now return a "PARTIAL" result if the device is
  partially inside the verification area

Fixes:
- Previously due to a miscommunication `device.sessions()` would return all
  created sessions. These have now been correctly limited to device-specific ones

## Version 2.0.0

Breaking changes:

- `client.devices.get()` now takes device identifiers as an object to reduce the number of parameters

Changes:

- SIM Swap functionality has been added to query device SIM Swap event dates
- Internal code cleanups

## Version 1.2.1

Fixes

- Fixed a bug that caused `Not Found` error in fetching slice attachments
- Prohibit the use of a device public IPv4 address as a literal string.

## Version 1.2.0

Breaking changes:

- None!

Changes:

- Added `slice.waitFor()` function to perform polling for slice state changes
- Internal refactoring
- Updated dependencies
- Improved test suite coverage and reliability

## Version 1.1.1

Breaking changes:

- None!

Changes:

- Minor refactors and bug fixes
- Updated dependencies

## Version 1.1.0

Breaking changes:

- None!

Changes:

- Updated API bindings for Device Status and integrated new connectivity and roaming status polling
- Integrated new Congestion Insights API for querying and predicting network congestion
