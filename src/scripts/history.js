/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
import browser from 'webextension-polyfill';
import QRCode from 'qrcode';

import {
    html,
    clear__btn,
    table,
    rate__button,
    home__button,
    main__element,
    chromeStoreLink,
    firefoxStoreLink,
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
        return 'firefox';
    }

    if (isOpera) {
        return 'opera';
    }

    return 'chrome';
};

/**
 *  Update Store Link
 */
const updateRatingButton = () => {
    const browserName = getBrowserInfo();

    switch (browserName) {
        case 'chrome':
        case 'opera': {
            $(rate__button).setAttribute('href', chromeStoreLink);
            break;
        }

        case 'firefox': {
            $(rate__button).setAttribute('href', firefoxStoreLink);
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
                updatedHTML = html.replace(/%longLink%/g, el.longUrl);
                pass += 1;
                updatedHTML = updatedHTML.replace(/%num%/g, pass);
                updatedHTML = updatedHTML.replace(/%shortLink%/g, el.shortUrl);
                // inject to DOM
                $(main__element).insertAdjacentHTML('afterbegin', updatedHTML);
            }
        } else {
            $(clear__btn).style.display = 'none';
            $(main__element).insertAdjacentHTML('afterbegin', '<h2 class="py-2">No Shortened URLs</h2>');
        }

        // update review link
        updateRatingButton();

        // update home page url
        const hostHomeUrl = devMode ? host : 'https://kutt.it';
        $(home__button).setAttribute('href', hostHomeUrl);
    } else {
        alert('Enable History from Options Page');

        // open options page in new tab
        browser.runtime.openOptionsPage();
    }
});

/**
 *  Clear all history
 */
$(clear__btn).on('click', async () => {
    await browser.storage.local.set({
        URL_array: [],
    });

    $(main__element).parentNode.removeChild($(main__element));
    $(clear__btn).style.display = 'none';
    $(table).insertAdjacentHTML('beforeend', '<h2 class="py-2 table-inner">No Shortened URLs</h2>');
});

/**
 *  Handle Buttons Click Actions
 */
const buttonAction = async (type, id) => {
    const flashCopyAlert = flashHTML => {
        $(`#table__shortened-${id}`).insertAdjacentHTML('afterbegin', flashHTML);

        setTimeout(() => {
            $('#flash_copy').parentNode.removeChild($('#flash_copy'));
        }, 1300);
    };

    // copy button
    if (type === 'copy') {
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

            const flashHTML = '<div class="table_body--flashCopy" id="flash_copy">Copied to clipboard!</div>';
            flashCopyAlert(flashHTML);
        } catch (error) {
            const flashHTML = '<div class="table_body--flashCopy" id="flash_copy">Error while Copying!!</div>';
            flashCopyAlert(flashHTML);
        }
    }
    // generate QRCode
    else if (type === 'qrcode') {
        // inject template
        let updatedHTML;
        const htmlContent = `<div class="table__qrcodePopup--div" id="qrcode__template"><div class="table__qrcode--popup"><div class="table__qrcode--holder"><img id="table__qrcode" src="%qrcodeLink%" alt="QRCode" /></div><div class="table__closebtn--holder"><button type="button" class="table__closebtn--inner" id="close__btn-%num%">Close</button></div></div></div>`;

        // 1. get short link
        const shortUrl = $(`#shortUrl-${id}`).textContent;

        // 2. generate qrcode
        try {
            const qrcodeURL = await QRCode.toDataURL(shortUrl);

            // 3. display popup menu with link
            updatedHTML = htmlContent.replace('%qrcodeLink%', qrcodeURL);
            updatedHTML = updatedHTML.replace('%num%', id);

            $(`#btns-${id}`).insertAdjacentHTML('afterend', updatedHTML);
        } catch (err) {
            // fetch qrcode from http://goqr.me
            const qrcode__api = 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=';

            updatedHTML = htmlContent.replace('%qrcodeLink%', `${qrcode__api}${shortUrl}`);
            $(`#btns-${id}`).insertAdjacentHTML('afterend', updatedHTML);
        }
    }
    // clear all button
    else if (type === 'close__btn') {
        $('#qrcode__template').parentNode.removeChild($('#qrcode__template'));
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
$(main__element).on('click', getButtonDetails);

/**
 *  prevent enter key press
 */
document.on('keypress', e => {
    const keyCode = e.which || e.keyCode;

    if (keyCode === 13) {
        e.preventDefault();
    }
});
