/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
import browser from 'webextension-polyfill';
import qr from 'qrcode';

import {
    HISTORY_TABLE_ITEM_HTML,
    CLEAR_HISTORY_BUTTON,
    HISTORY_VIEW_TABLE,
    RATE_NOW_BUTTON,
    DASHBOARD_BUTTON,
    HISTORY_VIEW_TABLE_PARENT_NODE,
    CHROME_STORE_LINK,
    FIREFOX_STORE_LINK,
    QR_EXTERNAL_API_URL,
    KUTT_IT_DEFAULT_DOMAIN,
    FIREFOX,
    OPERA,
    CHROME,
    ALERT_COPIED_HOLDER,
    NO_URLS_TO_SHOW,
    COPIED_TO_CLIPBOARD,
    FAILED_TO_COPY,
    QRCODE_POPUP_NODE_TEMPLATE,
    QRCODE_POPUP_NODE,
    COPY_BUTTON_ID,
    QRCODE_BUTTON_ID,
    QRCODE_POPUP_CLOSE_BUTTON_ID,
} from './constants';
import { $ } from './bling';

/**
 *  Identify Browser
 */
const getBrowserInfo = () => {
    // Chrome 1+
    const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

    // Firefox 1.0+
    const isFirefox = typeof InstallTrigger !== 'undefined';

    // Opera 8.0+
    // eslint-disable-next-line no-undef
    const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

    if (isFirefox) {
        return FIREFOX;
    }

    if (isOpera) {
        return OPERA;
    }

    return CHROME;
};

/**
 *  Update Store Link
 */
const updateRatingButton = () => {
    const browserName = getBrowserInfo();

    switch (browserName) {
        case CHROME:
        case OPERA: {
            $(RATE_NOW_BUTTON).setAttribute('href', CHROME_STORE_LINK);
            break;
        }

        case FIREFOX: {
            $(RATE_NOW_BUTTON).setAttribute('href', FIREFOX_STORE_LINK);
            break;
        }

        default:
            break;
    }
};

/**
 *  Update Home Page URL
 */

document.on('DOMContentLoaded', async () => {
    let updatedHTML;

    const {
        userOptions: { keepHistory, devMode },
        URL_array,
        host,
    } = await browser.storage.local.get(['userOptions', 'URL_array', 'host']);

    if (keepHistory) {
        const count = URL_array.length;

        // update DOM
        if (count > 0) {
            let pass = 0;

            for (const el of URL_array) {
                // Regular Expression Based Implementation
                updatedHTML = HISTORY_TABLE_ITEM_HTML.replace(/%longLink%/g, el.longUrl);
                pass += 1;
                updatedHTML = updatedHTML.replace(/%num%/g, pass);
                updatedHTML = updatedHTML.replace(/%shortLink%/g, el.shortUrl);
                // inject to DOM
                $(HISTORY_VIEW_TABLE_PARENT_NODE).insertAdjacentHTML('afterbegin', updatedHTML);
            }
        } else {
            $(CLEAR_HISTORY_BUTTON).style.display = 'none';
            $(HISTORY_VIEW_TABLE_PARENT_NODE).insertAdjacentHTML('afterbegin', NO_URLS_TO_SHOW);
        }

        // update review link
        updateRatingButton();

        // update home page url
        const hostHomeUrl = devMode ? host : KUTT_IT_DEFAULT_DOMAIN;
        $(DASHBOARD_BUTTON).setAttribute('href', hostHomeUrl);
    } else {
        alert('Enable History from Options Page');

        // open options page in new tab
        browser.runtime.openOptionsPage();
    }
});

/**
 *  Clear all history
 */
$(CLEAR_HISTORY_BUTTON).on('click', async () => {
    await browser.storage.local.set({
        URL_array: [],
    });

    $(HISTORY_VIEW_TABLE_PARENT_NODE).parentNode.removeChild($(HISTORY_VIEW_TABLE_PARENT_NODE));
    $(CLEAR_HISTORY_BUTTON).style.display = 'none';
    $(HISTORY_VIEW_TABLE).insertAdjacentHTML('beforeend', NO_URLS_TO_SHOW);
});

/**
 *  Handle Buttons Click Actions
 */
const buttonAction = async (type, id) => {
    const flashCopyAlert = flashHTML => {
        $(`#table__shortened-${id}`).insertAdjacentHTML('afterbegin', flashHTML);

        setTimeout(() => {
            $(ALERT_COPIED_HOLDER).parentNode.removeChild($(ALERT_COPIED_HOLDER));
        }, 1300);
    };

    // copy button
    if (type === COPY_BUTTON_ID) {
        const shortLink = $(`#shortUrl-${id}`).textContent;

        try {
            const el = document.createElement('textarea');
            el.value = shortLink;
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

            flashCopyAlert(COPIED_TO_CLIPBOARD);
        } catch (error) {
            flashCopyAlert(FAILED_TO_COPY);
        }
    }
    // generate QRCode
    else if (type === QRCODE_BUTTON_ID) {
        let updatedHTML;

        // 1. get short link
        const shortUrl = $(`#shortUrl-${id}`).textContent;

        // 2. generate qrcode
        try {
            const qrcodeURL = await qr.toDataURL(shortUrl);

            // 3. display popup menu with link
            updatedHTML = QRCODE_POPUP_NODE_TEMPLATE.replace('%qrcodeLink%', qrcodeURL);
            updatedHTML = updatedHTML.replace('%num%', id);

            $(`#btns-${id}`).insertAdjacentHTML('afterend', updatedHTML);
        } catch (err) {
            // fetch qrcode from http://goqr.me
            updatedHTML = QRCODE_POPUP_NODE_TEMPLATE.replace('%qrcodeLink%', `${QR_EXTERNAL_API_URL}${shortUrl}`);
            $(`#btns-${id}`).insertAdjacentHTML('afterend', updatedHTML);
        }
    } else if (type === QRCODE_POPUP_CLOSE_BUTTON_ID) {
        $(QRCODE_POPUP_NODE).parentNode.removeChild($(QRCODE_POPUP_NODE));
    }
};

/**
 *  get the delegation id (child node)
 */
const getButtonDetails = e => {
    let splitId;
    let type;
    let id;
    const eventId = e.target.id;

    if (eventId) {
        splitId = eventId.split('-');
        type = splitId[0];
        id = parseInt(splitId[1]);
        // perform action
        buttonAction(type, id);
    }
};

/**
 *  Button Action (qrcode / copy)
 */
$(HISTORY_VIEW_TABLE_PARENT_NODE).on('click', getButtonDetails);

/**
 *  prevent enter key press
 */
document.on('keypress', e => {
    const keyCode = e.which || e.keyCode;

    if (keyCode === 13) {
        e.preventDefault();
    }
});
