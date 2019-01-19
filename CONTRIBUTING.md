## Contributing Guidelines

## Assets
- [kutt.it API](https://github.com/thedevs-network/kutt#api) is used to retreive shortened URLs.

## Development
- `npm install` to install dependencies.
- To watch file changes in developement
    - Chrome
        - `npm run dev-chrome`
    - Firefox
        - `npm run dev-firefox`       
    - Opera
        - `npm run dev-opera`  

    (Reload Extension Manually in the browser)
- Load extension in browser
    - ### Chrome
      - Go to the browser address bar and type `chrome://extensions`
      - Check the `Developer Mode` button to enable it.
      - Click on the `Load Unpacked Extension…` button.
      - Select your extension’s extracted directory.

        <img width="400" src="https://i.imgur.com/dJRL7By.png" />

    - ### Firefox
      - Load the Add-on via `about:debugging` as temporary Add-on.
      - Choose the `manifest.json` file in the extracted directory

        <img width="400" src="https://i.imgur.com/aAL5dQg.png" />

    - ### Opera
      - Load the extension via `opera:extensions`
      - Check the `Developer Mode` and load as unpacked from extension’s extracted directory.

        <img width="400" src="https://i.imgur.com/qUwfSNJ.png" />

- Generate an API Key from <a href="https://kutt.it">`https://kutt.it/`</a> (Settings page)
- Paste and Save the `Key` in extension's `options page`.

`npm run build` builds the extension for all the browsers to `extension/(browser)` directory respectively.

## Testing
Download latest `Release`

[<img src=".github/assets/direct-download.png"
alt="Direct download"
height="50">](https://github.com/abhijithvijayan/kutt-extension/releases)

## ToDo

- [x] Switch to Promise return Method
- [x] Fix UI issues in Firefox
- [ ] Using Node-Kutt package(feature request)


## Note:
Shortening might take a while, it's not the issue with the extension but with <a href="https://github.com/thedevs-network/kutt">Kutt.it's API</a>.

### For Opera Users
In order to install this extension from Chrome Web Store, another opera extension called **Install Chrome Extension** should be installed first.

- [Opera addon :: Install Chrome Extension](https://addons.opera.com/en/extensions/details/install-chrome-extensions/)
- [Opera addon :: Kutt](https://chrome.google.com/webstore/detail/kutt/pklakpjfiegjacoppcodencchehlfnpd)

![](https://i.imgur.com/TJTisdC.png)
 