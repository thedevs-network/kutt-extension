import browser from 'webextension-polyfill';
import QRCode from 'qrcode';


let shortUrl, longUrl, start, API_key, password, keepHistory, autoCopy;
const qrcode__holder = document.getElementById('qr_code'),
    url__holder = document.getElementById('url__content-inner'),
    copy__btn = document.getElementById('button__copy--holder'),
    qrcode__btn = document.getElementById('button__qrcode--holder'),
    qrcode__api = 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=';


// Initialize
document.addEventListener('DOMContentLoaded', () => {

    // 1. KuttUrl
    browser.tabs.query({
        'active': true,
        'lastFocusedWindow': true
    }).then(tabs => {

        // extract page url
        longUrl = tabs[0].url;
        // extract first 4 chars
        start = longUrl.substr(0, 4);

        // i) Get api key from storage
        browser.storage.local.get(['key', 'pwd']).then(result => {

            API_key = result.key;
            password = result.pwd;

            // update DOM function
            const updateContent = (value) => {
                url__holder.textContent = value;
            };

            if (start === 'http' && API_key !== '' && API_key !== undefined) {

                // send start message to background.js and receive response
                browser.runtime.sendMessage({
                    msg: 'start',
                    API_key: API_key,
                    pageUrl: longUrl,
                    password: password
                }).then(response => {
                    // store the shortened link
                    shortUrl = response;
                    // status codes
                    if (!isNaN(response)) {
                        if (response === 429) {
                            updateContent('API Limit Exceeded!');
                        } else if (response === 401) {
                            updateContent('Invalid API Key');
                        } else if (response === 504) {
                            updateContent('Time-out!');
                        } else {
                            updateContent('Some error occured');
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
                                qrcode__holder.src = url;
                            })
                            .catch(err => {
                                // fetch qrcode from http://goqr.me (in case package fails)
                                qrcode__holder.src = `${qrcode__api}${shortUrl}`;
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
                                    const long_short_URLs = {
                                        longUrl: longUrl,
                                        shortUrl: shortUrl
                                    };
                                    browser.storage.local.get(['URL_array'])
                                        .then(result => {
                                            browser.runtime.sendMessage({
                                                msg: 'store',
                                                mix_URLs: long_short_URLs,
                                                URL_array: result.URL_array
                                            });
                                        });
                                }
                            });
                    } else {
                        updateContent('Invalid Response!');
                    }
                });

            } else if (API_key === '' || API_key === undefined) {
                // no api key set
                updateContent('Set API Key in Options!');

                const defaultOptions = {
                    pwdForUrls: false,
                    autoCopy: false,
                    keepHistory: true
                };
                // set defaults
                browser.storage.local.set({
                    userOptions: defaultOptions,
                    URL_array: []
                });

                // open options page
                setTimeout(() => {
                    browser.runtime.openOptionsPage();
                }, 900);

            } else if (start !== 'http') {
                updateContent('Not a Valid URL!!');
            }

        });

    });


    // 2. Copy Function
    function copyLink() {
        try {
            const copyTextarea = shortUrl;
            const input = document.createElement('textarea');
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
        } catch (error) {
            const el = document.getElementById('copy__alert');
            el.textContent = 'Error while Copying!';
            flasher('copy__alert');
            setTimeout(() => {
                flasher('copy__alert');
                el.textContent = 'Copied to clipboard!';
            }, 1300);
        }
    }


    // 3. Copy Button
    copy__btn.addEventListener('click', copyLink);


    // 4. QR Code Button
    qrcode__btn.addEventListener('click', () => {
        toggleDisplay('.qrcode__content--holder');
    });


    // 5. Display function
    function toggleDisplay(className) {
        const element = document.querySelector(className);
        element.classList.toggle('d-none');
    }

    // 6. Copy alert
    function flasher(id) {
        const element = document.getElementById(id);
        element.classList.toggle('v-none');
    }

});