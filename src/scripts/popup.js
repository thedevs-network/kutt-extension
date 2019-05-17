import browser from 'webextension-polyfill';
import { $, $$ } from './bling';
import QRCode from 'qrcode';

let shortUrl, longUrl, validUrl, API_key, password, keepHistory, autoCopy;

// constants
const qrcode__holder = '#qr_code',
    url__holder = '#url__content-inner',
    buttons = '.buttons__content--holder',
    copy__btn = '#button__copy--holder',
    copyalert__holder = '#copy__alert',
    qrcode__content = '.qrcode__content--holder',
    qrcode__btn = '#button__qrcode--holder',
    qrcode__api = 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=';


const updateDOMContent = (value) => {
    $(url__holder).textContent = value;
};


const openOptionsPage = () => {
    setTimeout(() => {
        browser.runtime.openOptionsPage();
    }, 900);
};


const toggleContentVisibility = (element) => {
    $(element).classList.toggle('d-none');
};


const toggleCopyAlert = () => {
    $(copyalert__holder).classList.toggle('v-none');
};


const generateQRCode = async url => {
    try {
        $(qrcode__holder).src = await QRCode.toDataURL(url);
    } catch (err) {
        // fetch qrcode from http://goqr.me api
        $(qrcode__holder).src = `${qrcode__api}${url}`;
    }
};


const copyLinkToClipboard = () => {
    // https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
    try {
        $(copyalert__holder).textContent = 'Copied to clipboard!';
        const el = document.createElement('textarea');
        el.value = shortUrl;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        const selected =
            document.getSelection().rangeCount > 0
                ? document.getSelection().getRangeAt(0)
                : false;
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
        $(copyalert__holder).textContent = 'Error while Copying!';
        toggleCopyAlert();
        setTimeout(() => {
            toggleCopyAlert();
        }, 1300);
    }
};


const addToHistory = async (curURLPair) => {
    const { URL_array } = await browser.storage.local.get(['URL_array']);
    // store to localstorage
    await browser.runtime.sendMessage({
        msg: 'store',
        curURLPair,
        curURLCollection: URL_array
    });
};


const doUserSetActions = async () => {
    const { userOptions } = await browser.storage.local.get(['userOptions']);
    keepHistory = userOptions.keepHistory;
    autoCopy = userOptions.autoCopy;

    if (autoCopy) {
        setTimeout(() => {
            copyLinkToClipboard();
        }, 500);
    }
    
    if (keepHistory) {
        const curURLPair = {
            longUrl,
            shortUrl
        };
        addToHistory(curURLPair);
    }
};


// Copy Button
$(copy__btn).on('click', () => copyLinkToClipboard());


// QR Code Button
$(qrcode__btn).on('click', () => {
    toggleContentVisibility(qrcode__content);
});


// Initialize url shortening
document.on('DOMContentLoaded', async () => {

    const tabs = await browser.tabs.query({
        'active': true,
        'lastFocusedWindow': true
    });

    // extract page url
    longUrl = tabs[0].url;
    // validate url
    validUrl = longUrl.startsWith('http');

    // Get credentials from localstorage
    const { key, pwd } = await browser.storage.local.get(['key', 'pwd']);
    API_key = key;
    password = pwd;

    if (validUrl && API_key !== '' && API_key !== undefined) {

        // send start message to background.js and get response
        const response = await browser.runtime.sendMessage({
            msg: 'start',
            API_key,
            pageUrl: longUrl,
            password
        });

        // status codes
        if (!isNaN(response)) {
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
            toggleContentVisibility(buttons);
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
    else if (API_key === '' || API_key === undefined) {
   
        updateDOMContent('Set API Key in Options!');

        const defaultOptions = {
            pwdForUrls: false,
            autoCopy: false,
            keepHistory: true,
            devMode: false
        };

        // set defaults
        await browser.storage.local.set({
            userOptions: defaultOptions,
            URL_array: []
        });

        openOptionsPage();

    } 
    // invalid url
    else if (!validUrl) {
        updateDOMContent('Not a Valid URL!!');
    }
});