import browser from 'webextension-polyfill';
import QRCode from 'qrcode';

let shortUrl;

document.addEventListener('DOMContentLoaded', () => {

    // 1. Initialize
    browser.tabs.query({ 'active': true, 'lastFocusedWindow': true }).then(tabs => {

        let longUrl, start, qrcode__backup = 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=';  // in case package fails
        let API_key, password, keepHistory, autoCopy;

        // extract page url
        longUrl = tabs[0].url;
        // extract first 4 chars
        start = longUrl.substr(0, 4);

        // i) Get api key from storage
        browser.storage.local.get(['key', 'pwd']).then(result => {

            API_key = result.key;
            password = result.pwd;

            // update DOM function
            let updateContent = (value) => {
                document.getElementById('url__content-inner').textContent = value;
            };

            if (start === 'http' && API_key !== '' && API_key !== undefined) {

                // send start message to background.js and receive response
                browser.runtime.sendMessage({ msg: 'start', API_key: API_key, pageUrl: longUrl, password: password }).then(response => {
                    // store the shortened link
                    shortUrl = response;
                    // status codes
                    if (!isNaN(shortUrl)) {
                        if (shortUrl === 429) {
                            updateContent('API Limit Exceeded!');
                        } else if (shortUrl === 401) {
                            updateContent('Invalid API Key');
                            // } else if (shortUrl === 400) {
                            //     updateContent('Unknown Error!!!');
                        } else if (shortUrl === 504) {
                            updateContent('Time-out!');
                        } else {
                            updateContent('Unknown Error!!!');
                        }
                    }
                    // valid response
                    else if (shortUrl !== null) {
                        // 1. update the content with shortened link
                        updateContent(shortUrl);
                        // 2. show buttons                        
                        toggleDisplay('.buttons__content--holder');
                        // 3. QR Code Generation
                        QRCode.toDataURL(shortUrl)
                            .then(url => {
                                document.getElementById('qr_code').src = url;
                            })
                            .catch(err => {
                                // fetch qrcode from http://goqr.me (in case package fails)
                                document.getElementById('qr_code').src = `${qrcode__backup}${shortUrl}`;
                            });
                        // 4. Add to history
                        browser.storage.local.get(['userOptions'])
                            .then(result => {
                                keepHistory = result.userOptions.keepHistory;
                                autoCopy = result.userOptions.autoCopy;
                                // auto copy
                                if (autoCopy) {
                                    setTimeout(() => {
                                        copyLink();
                                    }, 500);
                                }
                                if (keepHistory) {
                                    // pass the object of URLs
                                    let long_short_URLs = {
                                        longUrl: longUrl,
                                        shortUrl: shortUrl
                                    };
                                    browser.storage.local.get(['URL_array'])
                                        .then(result => {
                                            browser.runtime.sendMessage({ msg: 'store', mix_URLs: long_short_URLs, URL_array: result.URL_array });
                                        });
                                    // .catch(err => {
                                    //     console.log('localstorage_warning : Failed to Fetch.' + err);
                                    // });
                                }
                            });
                        // .catch(err => {
                        //     console.log('localstorage_warning : Failed to Fetch.');
                        // });
                    }
                    else {
                        updateContent('Invalid Response!');
                    }
                });

            }
            else if (API_key === '' || API_key === undefined) {
                // no api key set
                updateContent('Set API Key in Options!');

                let defaultOptions = {
                    pwdForUrls: false,
                    autoCopy: false,
                    keepHistory: true
                };
                browser.storage.local.set({ userOptions: defaultOptions, URL_array: [] });

                // open options page
                setTimeout(() => {
                    browser.runtime.openOptionsPage();
                }, 900);

            }
            else if (start !== 'http') {
                updateContent('Not a Valid URL!!');
            }

        });

    });


    function copyLink() {
        try {
            let copyTextarea = shortUrl;
            let input = document.createElement('textarea');
            document.body.appendChild(input);
            input.value = copyTextarea;
            input.focus();
            input.select();
            document.execCommand('copy');
            input.remove();
            flasher('copy__alert');
            setTimeout(() => {
                flasher('copy__alert');
            }, 1300);
        }
        catch (error) {
            let el = document.getElementById('copy__alert');
            el.textContent = 'Error while Copying!';
            flasher('copy__alert');
            setTimeout(() => {
                flasher('copy__alert');
                el.textContent = 'Copied to clipboard!';
            }, 1300);
        }
    }


    // 2. Copy Function
    document.getElementById('button__copy--holder').addEventListener('click', copyLink);


    // 3. QR Code
    document.getElementById('button__qrcode--holder').addEventListener('click', () => {
        toggleDisplay('.qrcode__content--holder');
    });


    // 4. elements display function
    function toggleDisplay(className) {
        let element = document.querySelector(className);
        element.classList.toggle('d-none');
    }


    function flasher(id) {
        let element = document.getElementById(id);
        element.classList.toggle('v-none');
    }

});