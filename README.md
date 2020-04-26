<div align="center"><img width="150" src="source/assets/logo.png" /></div>
<h1 align="center">kutt-extension</h1>
<p align="center">Browser extension to shorten long URLs based on <a href="https://kutt.it">Kutt.it</a></p>
<div align="center">
  <a href="https://travis-ci.org/abhijithvijayan/kutt-extension">
    <img src="https://travis-ci.org/abhijithvijayan/kutt-extension.svg?branch=master" alt="Travis Build" />
  </a>
  <a href="https://github.com/abhijithvijayan/kutt-extension/releases/latest">
    <img src="https://img.shields.io/github/release/abhijithvijayan/kutt-extension.svg?colorB=blue" alt="Releases" />
  </a>
  <a href="https://github.com/abhijithvijayan/kutt-extension/issues?q=is%3Aopen+is%3Aissue">
    <img src="https://img.shields.io/github/issues-raw/abhijithvijayan/kutt-extension.svg?colorB=lightgrey" alt="Open Issues" />
  </a>
  <a href="https://github.com/abhijithvijayan/kutt-extension/issues?q=is%3Aissue+is%3Aclosed">
    <img src="https://img.shields.io/github/issues-closed-raw/abhijithvijayan/kutt-extension.svg?colorB=red" alt="Closed Issues" />
  </a>
  <a href="https://david-dm.org/abhijithvijayan/kutt-extension">
    <img src="https://img.shields.io/david/abhijithvijayan/kutt-extension.svg?colorB=orange" alt="DEPENDENCIES" />
  </a>
  <a href="https://github.com/abhijithvijayan/kutt-extension/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/abhijithvijayan/kutt-extension.svg" alt="LICENSE" />
  </a>
</div>
<h3 align="center">🙋‍♂️ Made by <a href="https://twitter.com/_abhijithv">@abhijithvijayan</a></h3>
<p align="center">
  Donate:
  <a href="https://www.paypal.me/iamabhijithvijayan" target='_blank'><i><b>PayPal</b></i></a>,
  <a href="https://www.patreon.com/abhijithvijayan" target='_blank'><i><b>Patreon</b></i></a>
</p>
<p align="center">
  <a href='https://www.buymeacoffee.com/abhijithvijayan' target='_blank'>
    <img height='36' style='border:0px;height:36px;' src='https://bmc-cdn.nyc3.digitaloceanspaces.com/BMC-button-images/custom_images/orange_img.png' border='0' alt='Buy Me a Coffee' />
  </a>
</p>
<hr />

### v2 React + TypeScript (🚧 [WIP](https://github.com/abhijithvijayan/kutt-extension/tree/refactor/react-typescript))

## Features

- Minimal UI
- Instant QR Code
- Cross Browser Support
- Supports Secure Passwords for URLs
- History & Incognito Feature
- Auto Copy Feature
- Free and Open Source
- Uses WebExtensions API

## Browser Support

| [![Chrome](https://raw.github.com/alrra/browser-logos/master/source/chrome/chrome_48x48.png)](https://chrome.google.com/webstore/detail/kutt/pklakpjfiegjacoppcodencchehlfnpd) | [![Firefox](https://raw.github.com/alrra/browser-logos/master/source/firefox/firefox_48x48.png)](https://addons.mozilla.org/firefox/addon/kutt/) | [![Opera](https://raw.github.com/alrra/browser-logos/master/source/opera/opera_48x48.png)](CONTRIBUTING.md#for-opera-users) | [![Edge](https://raw.github.com/alrra/browser-logos/master/source/edge/edge_48x48.png)](https://chrome.google.com/webstore/detail/kutt/pklakpjfiegjacoppcodencchehlfnpd) | [![Yandex](https://raw.github.com/alrra/browser-logos/master/source/yandex/yandex_48x48.png)](https://chrome.google.com/webstore/detail/kutt/pklakpjfiegjacoppcodencchehlfnpd) | [![Brave](https://raw.github.com/alrra/browser-logos/master/source/brave/brave_48x48.png)](https://chrome.google.com/webstore/detail/kutt/pklakpjfiegjacoppcodencchehlfnpd) | [![vivaldi](https://raw.github.com/alrra/browser-logos/master/source/vivaldi/vivaldi_48x48.png)](https://chrome.google.com/webstore/detail/kutt/pklakpjfiegjacoppcodencchehlfnpd) |
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 49 & later ✔ | 52 & later ✔ | 36 & later ✔ | 79 & later ✔ | Latest ✔ | Latest ✔ | Latest ✔

## How to use

- Download for browser(s)

  - Chrome: [Kutt :: Chrome Web Store](https://chrome.google.com/webstore/detail/kutt/pklakpjfiegjacoppcodencchehlfnpd)
  - Firefox: [Kutt :: Add-ons for Firefox](https://addons.mozilla.org/firefox/addon/kutt/)
  - Opera [Kutt :: Opera addons](CONTRIBUTING.md#for-opera-users)
  - Edge: [Kutt :: Chrome Web Store](https://chrome.google.com/webstore/detail/kutt/pklakpjfiegjacoppcodencchehlfnpd)

- Generate an API Key from <a href="https://kutt.it">`https://kutt.it/`</a> after signing up. (Settings page)

  <img width="400" src="https://i.imgur.com/qQwqeH5.png" />

- Paste and Save this `Key` in extension's `options page` when asked.

 <hr />

## Screenshots

<div>
  <img width="250" src="./.github/assets/popup.png" alt="image1" />
</div>

<br />

## Note:

- <a href="https://kutt.it">Kutt.it</a> API permits **50** URLs shortening per day using the API Key.
- **Enable Custom Host** option to use with self-hosted kutt
  - Save the self hosted domain in the input (eg: https://mykutt.it)
    - **Note**: the api endpoint is automatically appended during the api call.
- _Delay at times while shortening might be the issue with Kutt.it API and not with the extension's._

## Contributing and Support

View the Contributing guidelines [here](CONTRIBUTING.md).

Original Repo: [thedevs-network/kutt](https://github.com/thedevs-network/kutt)

## Show your support

Give a ⭐️ if this project helped you!

## Licence

Code released under the [MIT License](LICENSE).
