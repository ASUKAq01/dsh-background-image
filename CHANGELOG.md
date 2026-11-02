# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-11-02

### Added

- Upload or drag-and-drop a local image as the Harness Web UI background.
- Adjustable background opacity (0–100%) and blur (0–40 px).
- Light and dark theme support through a theme-colored veil.
- Settings page in **Settings → Plugins → Background**, plus a plugin-row
  configuration page.
- Image compression to WebP/JPEG in the browser, stored locally in
  `localStorage`; no upload or network request.
- Effect-scoped cleanup: disabling or uninstalling the plugin restores the
  original surface tokens and removes every injected style.

[Unreleased]: https://github.com/ASUKAq01/dsh-background-image/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/ASUKAq01/dsh-background-image/releases/tag/v1.0.0
