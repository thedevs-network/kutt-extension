/* eslint-disable camelcase */
import browser from 'webextension-polyfill';
import qr from 'qrcode';

import {
    QRCODE_IMAGE_NODE,
    URL_HOLDER,
    BUTTONS_GROUP,
    COPY_BUTTON,
    COPIED_ALERT_HOLDER,
    QRCODE_BUTTON,
    QR_EXTERNAL_API_URL,
    QRCODE_HOLDER,
} from './constants';
import { $ } from './bling';

let shortUrl;
let longUrl;
let API_KEY;
let password;
let validUrl = '';

/**
 *  DOM Message Update function
 */
const updateDOMContent = value => {
    $(URL_HOLDER).textContent = value;
};

/**
 *  Trigger Opening Options Page
 */
const openOptionsPage = () => {
    setTimeout(() => {
        browser.runtime.openOptionsPage();
    }, 900);
};

/**
 *  Show / Hide Components
 *
 *  @param {String} element ID or class
 */
const toggleContentVisibility = element => {
    $(element).classList.toggle('d-none');
};

/**
 *  Show / Hide copied text alert
 */
const toggleCopyAlert = () => {
    $(COPIED_ALERT_HOLDER).classList.toggle('v-none');
};

/**
 *  QR Code generator
 *
 *  @param {String} url
 */
const generateQRCode = async sourceUrl => {
    try {
        $(QRCODE_IMAGE_NODE).src = await qr.toDataURL(sourceUrl);
    } catch (err) {
        // fetch qrcode from http://goqr.me api
        $(QRCODE_IMAGE_NODE).src = `${QR_EXTERNAL_API_URL}${sourceUrl}`;
    }
};

/**
 *  Copy Link to Clipboard
 */
const copyLinkToClipboard = () => {
    // https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
    try {
        $(COPIED_ALERT_HOLDER).textContent = 'Copied to clipboard!';
        const el = document.createElement('textarea');
        el.value = shortUrl;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        if (selected) {
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(selected);
        }

        toggleCopyAlert();
        setTimeout(() => {
            toggleCopyAlert();
        }, 1300);
    } catch (error) {
        $(COPIED_ALERT_HOLDER).textContent = 'Error while Copying!';

        toggleCopyAlert();
        setTimeout(() => {
            toggleCopyAlert();
        }, 1300);
    }
};

/**
 *  Add URL to localstorage array
 */
const addToHistory = async curURLPair => {
    const { URL_array } = await browser.storage.local.get(['URL_array']);

    // store to localstorage
    await browser.runtime.sendMessage({
        msg: 'store',
        curURLPair,
        curURLCollection: URL_array,
    });
};

/**
 *  Handle User Preferred Actions (autoCopy/keepHistory)
 */
const doUserSetActions = async () => {
    const { userOptions } = await browser.storage.local.get(['userOptions']);
    const { keepHistory, autoCopy } = userOptions;

    if (autoCopy) {
        setTimeout(() => {
            copyLinkToClipboard();
        }, 500);
    }

    if (keepHistory) {
        const curURLPair = {
            longUrl,
            shortUrl,
        };

        addToHistory(curURLPair);
    }
};

/**
 *  Handle copying on button click
 */
$(COPY_BUTTON).on('click', () => {
    return copyLinkToClipboard();
});

/**
 *  Show / Hide QRCode on button click
 */
$(QRCODE_BUTTON).on('click', () => {
    toggleContentVisibility(QRCODE_HOLDER);
});

/**
 *  Driver Function
 */
document.addEventListener('DOMContentLoaded', async () => {
    const tabs = await browser.tabs.query({
        active: true,
        lastFocusedWindow: true,
    });

    // extract page url
    longUrl = tabs.length && tabs[0].url;

    // validate url
    if (longUrl) {
        validUrl = longUrl.startsWith('http');
    }

    // Get API Key / Password from localstorage
    const { key, pwd } = await browser.storage.local.get(['key', 'pwd']);

    API_KEY = key;
    password = pwd;

    if (validUrl && API_KEY !== '' && API_KEY !== undefined) {
        /**
         *  Initialize url shortening (send message to background.js)
         */
        const response = await browser.runtime.sendMessage({
            msg: 'shorten',
            API_KEY,
            pageUrl: longUrl,
            password,
        });

        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(response)) {
            // status codes
            switch (response) {
                case 429:
                    updateDOMContent('API Limit Exceeded!');
                    break;
                case 401:
                    updateDOMContent('Invalid API Key');
                    openOptionsPage();
                    break;
                case 504:
                    updateDOMContent('Time-out!');
                    break;
                default:
                    updateDOMContent('Some error occured');
                    break;
            }
        }
        // got valid response
        else if (response) {
            shortUrl = response;
            // show shortened kutt url
            updateDOMContent(shortUrl);
            // Show action buttons
            toggleContentVisibility(BUTTONS_GROUP);
            // Generate QR Code
            generateQRCode(shortUrl);
            // perform user-set actions
            doUserSetActions();
        }
        // all test-cases fail
        else {
            updateDOMContent('Invalid Response!');
        }
    }
    // no API key set
    else if (API_KEY === '' || API_KEY === undefined) {
        updateDOMContent('Set API Key in Options!');

        const defaultOptions = {
            pwdForUrls: false,
            autoCopy: false,
            keepHistory: true,
            devMode: false,
        };

        // set defaults
        await browser.storage.local.set({
            userOptions: defaultOptions,
            URL_array: [],
        });

        openOptionsPage();
    }
    // invalid url
    else if (!validUrl) {
        updateDOMContent('Not a Valid URL!!');
    } else {
        updateDOMContent('Some error occured');
    }
});
