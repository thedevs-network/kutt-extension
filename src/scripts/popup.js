import browser from 'webextension-polyfill';
import { $, $$ } from './bling';
import QRCode from 'qrcode';


let shortUrl, longUrl, start, API_key, password, keepHistory, autoCopy;
const qrcode__holder = '#qr_code',
    url__holder = '#url__content-inner',
    buttons = '.buttons__content--holder',
    copy__btn = '#button__copy--holder',
    qrcode__btn = '#button__qrcode--holder',
    qrcode__api = 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=';


// update DOM function
const updateContent = (value) => {
    $(url__holder).textContent = value;
};

// Display function
const toggleView = (element) => {
    $(element).classList.toggle('d-none');
};

// Copy alert
const flasher = (id) => {
    $(id).classList.toggle('v-none');
};

// Copy Function
const copyLink = () => {
    try {
        $('#copy__alert').textContent = 'Copied to clipboard!';
        const el = document.createElement('textarea');
        el.value = shortUrl;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        flasher('#copy__alert');
        setTimeout(() => {
            flasher('#copy__alert');
        }, 1300);

    } catch (error) {
        $('#copy__alert').textContent = 'Error while Copying!';
        flasher('#copy__alert');
        setTimeout(() => {
            flasher('#copy__alert');
        }, 1300);
    }
};

// Initialize
document.on('DOMContentLoaded', async () => {

    const tabs = await browser.tabs.query({
        'active': true,
        'lastFocusedWindow': true
    });

    // extract page url
    longUrl = tabs[0].url;
    // extract first 4 chars
    start = longUrl.substr(0, 4);

    // i) Get credentials from localstorage
    const { key, pwd } = await browser.storage.local.get(['key', 'pwd']);
    API_key = key;
    password = pwd;

    if (start === 'http' && API_key !== '' && API_key !== undefined) {

        // send start message to background.js and receive response
        const response = await browser.runtime.sendMessage({
            msg: 'start',
            API_key,
            pageUrl: longUrl,
            password
        });

        // status codes
        if (!isNaN(response)) {
            switch(response) {
            case 429: updateContent('API Limit Exceeded!');
                break;
            case 401: updateContent('Invalid API Key');
                break;
            case 504: updateContent('Time-out!');
                break;
            default: updateContent('Some error occured');
                break;
            }
        }
        // valid response
        else if (response) {
            shortUrl = response;
            // 1. Update DOM
            updateContent(shortUrl);
            // 2. Show buttons                        
            toggleView(buttons);
            // 3. Generate QR Code 
            QRCode.toDataURL(shortUrl)
                .then(url => {
                    $(qrcode__holder).src = url;
                })
                .catch(err => {
                    // fetch qrcode from http://goqr.me (in case package fails)
                    $(qrcode__holder).src = `${qrcode__api}${shortUrl}`;
                });

            // 4. Add to history
            const { userOptions } = await browser.storage.local.get(['userOptions']);
            keepHistory = userOptions.keepHistory;
            autoCopy = userOptions.autoCopy;

            if (autoCopy) {
                setTimeout(() => {
                    copyLink();
                }, 500);
            }
            if (keepHistory) {
                // pass the object of URLs
                const long_short_URLs = {
                    longUrl,
                    shortUrl
                };

                const { URL_array } = await browser.storage.local.get(['URL_array']);
                // store to localstorage
                await browser.runtime.sendMessage({
                    msg: 'store',
                    mix_URLs: long_short_URLs,
                    URL_array
                });
            }
        } else {
            updateContent('Invalid Response!');
        }

    } else if (API_key === '' || API_key === undefined) {
        // no API key set
        updateContent('Set API Key in Options!');

        const defaultOptions = {
            pwdForUrls: false,
            autoCopy: false,
            keepHistory: true
        };

        // set defaults
        await browser.storage.local.set({
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

    // Copy Button
    $(copy__btn).on('click', copyLink);

    // QR Code Button
    $(qrcode__btn).on('click', () => {
        toggleView('.qrcode__content--holder');
    });

});