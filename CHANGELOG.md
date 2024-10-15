# Changelog

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
