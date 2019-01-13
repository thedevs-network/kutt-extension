## Contributing Guidelines

## Assets
- [kutt.it API](https://github.com/thedevs-network/kutt#api) is used to retreive shortened URLs.
- QR Code is generated using <a href="http://goqr.me/">`http://goqr.me/`</a> API

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
- Load extension as unpacked from `chrome|firefox|opera/` directory.
- Generate an API Key from <a href="https://kutt.it">`https://kutt.it/`</a> (Settings page)
- Paste and Save the `Key` in extension's `options page`.

`npm run build-all` builds the extension to `chrome|firefox|opera` directory.

## Testing
Download latest `Pre-Release`

[<img src=".github/assets/direct-download.png"
alt="Direct download"
height="50">](https://github.com/abhijithvijayan/kutt-extension/releases)

## ToDo

- [x] Switch to Promise return Method
- [ ] Fix UI issues in Firefox
- [ ] Using Node-Kutt package(feature request)


## Note:
Shortening may take a while, it's not the issue with the extension but with <a href="https://github.com/thedevs-network/kutt">Kutt.it's API</a>.