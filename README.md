<div align="center"><img width="150" src="source/public/assets/logo.png" /></div>
<h1 align="center">kutt-extension</h1>
<p align="center">Browser extension for <a href="https://kutt.it">Kutt.it</a> URL shortener</p>
<div align="center">
  <a href="https://github.com/thedevs-network/kutt-extension/actions/workflows/build.yml">
    <img src="https://github.com/thedevs-network/kutt-extension/actions/workflows/build.yml/badge.svg?branch=master" alt="Build" />
  </a>
  <a href="https://github.com/thedevs-network/kutt-extension/releases/latest">
    <img src="https://img.shields.io/github/release/thedevs-network/kutt-extension.svg?colorB=blue" alt="Releases" />
  </a>
  <a href="https://github.com/thedevs-network/kutt-extension/issues?q=is%3Aopen+is%3Aissue">
    <img src="https://img.shields.io/github/issues-raw/thedevs-network/kutt-extension.svg?colorB=lightgrey" alt="Open Issues" />
  </a>
  <a href="https://github.com/thedevs-network/kutt-extension/issues?q=is%3Aissue+is%3Aclosed">
    <img src="https://img.shields.io/github/issues-closed-raw/thedevs-network/kutt-extension.svg?colorB=red" alt="Closed Issues" />
  </a>
  <a href="https://github.com/thedevs-network/kutt-extension/blob/master/license">
    <img src="https://img.shields.io/github/license/thedevs-network/kutt-extension.svg" alt="LICENSE" />
  </a>
</div>
<hr />

❤️ it? ⭐️ it on [GitHub](https://github.com/thedevs-network/kutt-extension/stargazers)

## Features

- Minimal UI
- Instant QR Code
- Cross Browser Support
- Supports Secure Passwords for URLs
- History & Incognito Feature
- Auto Copy Feature
- Free and Open Source
- Uses WebExtensions API

## Tech Stack

- **Bundler**: [Vite](https://vitejs.dev/) 6
- **UI**: [React](https://react.dev/) 19
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5.7
- **Styling**: SCSS with CSS Modules
- **Linting**: ESLint 9 (flat config) + Prettier

## Browser Support

This extension uses **Manifest V3**.

| [![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png)](https://chrome.google.com/webstore/detail/kutt/pklakpjfiegjacoppcodencchehlfnpd) | [![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png)](https://addons.mozilla.org/firefox/addon/kutt/) | [![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png)](CONTRIBUTING.md#for-opera-users) | [![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png)](https://chrome.google.com/webstore/detail/kutt/pklakpjfiegjacoppcodencchehlfnpd) | [![Brave](https://raw.github.com/alrra/browser-logos/master/src/brave/brave_48x48.png)](https://chrome.google.com/webstore/detail/kutt/pklakpjfiegjacoppcodencchehlfnpd) |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 88+                                                                                                                                                                         | 109+                                                                                                                                          | 74+                                                                                                                      | 88+ (Chromium)                                                                                                                                                              | Latest (Chromium)                                                                                                                                                        |

## Installation

- **Chrome**: [Kutt :: Chrome Web Store](https://chrome.google.com/webstore/detail/kutt/pklakpjfiegjacoppcodencchehlfnpd)
- **Firefox**: [Kutt :: Add-ons for Firefox](https://addons.mozilla.org/firefox/addon/kutt/)
- **Opera**: [Kutt :: Opera addons](CONTRIBUTING.md#for-opera-users)
- **Edge**: [Kutt :: Chrome Web Store](https://chrome.google.com/webstore/detail/kutt/pklakpjfiegjacoppcodencchehlfnpd)

## How to Use

1. Generate an API Key from <a href="https://kutt.it">`https://kutt.it/`</a> after signing up (Settings page)

   <img width="400" src="https://i.imgur.com/qQwqeH5.png" />

2. Paste and Save this `Key` in extension's `options page` when asked

## Screenshots

<div>
  <img width="250" src="./.github/assets/popup-v4-1.png" alt="popup" />
  <div>_</div>
  <img width="330" src="./.github/assets/options-v4-1.png" alt="options" />
</div>

## Development

Ensure you have [Node.js](https://nodejs.org) 20 or later installed.

```bash
# Install dependencies
npm install

# Start development server
npm run dev:chrome    # For Chrome
npm run dev:firefox   # For Firefox

# Build for production
npm run build:chrome  # Build Chrome extension
npm run build:firefox # Build Firefox addon
npm run build         # Build for all browsers

# Linting
npm run lint          # Run ESLint
npm run lint:fix      # Run ESLint with auto-fix
```

### Loading the Extension

#### Chrome

1. Navigate to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `extension/chrome` directory

#### Firefox

1. Navigate to `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select `extension/firefox/manifest.json`

## Note

- <a href="https://kutt.it">Kutt.it</a> API permits **50** URLs shortening per day using the API Key
- **Enable Custom Host** option to use with self-hosted kutt
  - Save the self hosted domain in the input (eg: `https://mykutt.it`)
  - **Note**: the api endpoint is automatically appended during the api call
- _Delay at times while shortening might be the issue with Kutt.it API and not with the extension's_

## Contributing and Support

View the Contributing guidelines [here](CONTRIBUTING.md).

Original Repo: [thedevs-network/kutt](https://github.com/thedevs-network/kutt)

## License

Code released under the [MIT License](license).
