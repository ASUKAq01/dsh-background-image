<p align="center">
  <img src="icon.svg" width="96" height="96" alt="Background Image icon" />
</p>

<h1 align="center">DSH Background Image</h1>

<p align="center">
  A lightweight client plugin that gives the DeepSeek Harness Web UI a custom background image.<br />
  Upload an image, tune opacity and blur — the appearance changes, never the layout.
</p>

<p align="center">
  <a href="https://github.com/ASUKAq01/dsh-background-image/actions/workflows/validate.yml"><img src="https://github.com/ASUKAq01/dsh-background-image/actions/workflows/validate.yml/badge.svg" alt="validate" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/ASUKAq01/dsh-background-image" alt="MIT License" /></a>
  <a href="CHANGELOG.md"><img src="https://img.shields.io/badge/version-1.0.0-blue" alt="1.0.0" /></a>
</p>

<p align="center">
  <a href="README.md">简体中文</a> · English
</p>

---

## Features

- **Upload and go** — pick or drop a JPG / PNG / WebP / GIF; it is scaled and
  re-encoded in the browser.
- **Two sliders** — background opacity (0–100%) and blur (0–40 px), applied live.
- **Theme aware** — a white veil in light mode and a `#151517` veil in dark mode;
  switching themes needs no action.
- **Layout safe** — a fixed `z-index: -1` / `pointer-events: none` layer that
  never joins layout or blocks clicks.
- **Readable** — only the canvas, conversation area and sidebar become
  transparent; cards, inputs and popovers keep their opaque surfaces.
- **Local only** — the compressed image is stored in this browser's
  `localStorage`; nothing is uploaded and no network request is made.
- **Clean uninstall** — disabling or removing the plugin disposes its styles,
  CSS variables, token overrides and class names.
- **Bilingual UI** — the settings page follows the Harness locale (Chinese or English).

## Install

The plugin is distributed through GitHub. Requires DeepSeek Harness
`>=0.1.7-rc.1 <0.3.0-0`.

### DSH Plugin Manager

```sh
git clone https://github.com/ASUKAq01/dsh-background-image.git
```

In Harness, open **Settings → Plugins**, use the local-directory install entry,
and select the cloned `dsh-background-image` directory. Enable it and refresh
the page once.

### `dsh` CLI

```sh
git clone https://github.com/ASUKAq01/dsh-background-image.git
dsh plugin --profile <profile> add ./dsh-background-image
```

Replace `<profile>` with your active profile (for example `desktop` or `web`),
then restart or refresh Harness.

### npm

Not published to npm yet. `package.json` already uses the name
`@asukaq01/dsh-background-image`, so once published:

```sh
dsh plugin --profile <profile> add @asukaq01/dsh-background-image
```

## Usage

1. Open **Settings → Plugins → Background** (or the configuration entry on the
   plugin's row in the installed list).
2. Choose an image, or drop one onto the preview.
3. Adjust **Background opacity** and **Blur**; close Settings to see the full
   window effect.
4. **Remove** deletes the stored image and restores the original appearance.

> After the first install, refresh the page once so the browser loads the new
> client module.

## Storage and privacy

- The image lives only in the current browser's `localStorage`:
  - `dsh.background-image.image.v1` — compressed image and dimensions;
  - `dsh.background-image.settings.v1` — opacity and blur.
- Images are scaled to a 2560 px longest edge and encoded as WebP when possible
  so they fit the local storage quota.
- The plugin uploads nothing, reads no session content and performs no network
  requests.
- Clearing site data or pressing **Remove** deletes the stored image.

## Compatibility

- DeepSeek Harness `>=0.1.7-rc.1 <0.3.0-0`
- Client services: `ctx.slots`, `ctx.locale`, `ctx.theme.overrideTokens`
- Slots: `settings.plugins.tab`, `plugins.row.config`
- No build step; `client.js` loads directly in the Harness module format

## How it works

- The background is `html.dshbg-on body::before`: `position: fixed`,
  `inset: -180px`, `z-index: -1`, `pointer-events: none`; the negative inset
  leaves room for blurred edges.
- `ctx.theme.overrideTokens` overrides exactly two color tokens:
  `--dsw-alias-bg-base` and `--dsw-specific-sidebar-fill` become
  `transparent`. Other surfaces keep `--dsw-alias-bg-layer-*`, so text and
  controls stay readable.
- Opacity maps to the alpha of a theme-colored veil above the photo; blur is
  applied to the fixed layer itself.
- The settings page and the plugin-row configuration page share one store and
  one form component.
- Every style, subscription and token override is registered through
  `ctx.effect`, so uninstalling cleans up automatically.

## Development

No bundler or compiler. Install the repository directory into a profile and
refresh the page.

```sh
node scripts/validate.mjs
```

The validator checks `package.json` fields and export paths, both locale files,
the SVG icon and its size, the `cordis.patch.yml` row declaration, and the
syntax of `index.js` / `client.js`. GitHub Actions runs the same script on every
push and pull request.

## Layout

```text
.
├── client.js               # all browser-side code (layer + settings page)
├── index.js                # empty Host half (a bundle needs a Host row)
├── cordis.patch.yml        # inserts the background-image row
├── locale/
│   ├── en.json             # Plugin Manager metadata (English)
│   └── zh.json             # Plugin Manager metadata (Chinese)
├── icon.svg                # plugin icon
├── scripts/validate.mjs    # dependency-free validator
├── .github/workflows/      # CI
├── README.md / README.en.md
├── CHANGELOG.md
└── LICENSE
```

## License

[MIT](LICENSE) © 2026 ASUKAq01

The icon is an original work distributed with this repository under the same
MIT license.
