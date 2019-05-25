import browser from 'webextension-polyfill';
import { $ } from './bling';
import QRCode from 'qrcode';


// constants
const clear__btn = '#table__clearAll--btn',
    table = '.table__content--holder',
    rate__button = '#rate__button',
    main__element = '#delegation__element',
    chromeStoreLink = 'https://chrome.google.com/webstore/detail/kutt/pklakpjfiegjacoppcodencchehlfnpd/reviews',
    firefoxStoreLink = 'https://addons.mozilla.org/en-US/firefox/addon/kutt/';

const html = `
    <tr class="table__body--holder" id="table__body-%num%">
        <td class="table__body--original">
            <a href="%longLink%" class="table__body--originalURL" target="_blank" rel="noopener">%longLink%</a>
        </td>
        <td class="table__body--shortened" id="table__shortened-%num%">
            <div class="table__body--shortenBody">
                <a href="%shortLink%" id="shortUrl-%num%" class="table__body--shortenURL" target="_blank" rel="noopener">%shortLink%</a>
            </div>
        </td>
        <td class="table__body--functionBtns">
            <div class="table__body--btnHolder" id="btns-%num%">
                <button type="button" class="table__body--copy" id="copy-%num%" title="Copy">
                    <img class="selectDisable icon__img" src="assets/copy.svg" alt="copy" />
                </button>
                <button type="button" class="table__body--qrcode" id="qrcode-%num%" title="QR Code">
                    <img class="selectDisable icon__img" src="assets/qrcode.svg" alt="QR Code" />
                </button>
            </div>
        </td>
    </tr>`;


const getBrowserInfo = () => {
    // Chrome 1+
    const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    // Firefox 1.0+
    const isFirefox = typeof InstallTrigger !== 'undefined';
    // Opera 8.0+
    const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    if (isFirefox) {
        return 'firefox';
    }
    if (isOpera) {
        return 'opera';
    }
    if (isChrome) {
        return 'chrome';
    }
    return;
};


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
    default: break;
    }
};


document.on('DOMContentLoaded', async () => {
    let updatedHTML;

    const response = await browser.storage.local.get(['userOptions', 'URL_array']);
    
    if (response.userOptions.keepHistory) {
        const count = response.URL_array.length;
        // update DOM
        if (count > 0) {
            let pass = 0;
            for (let el of response.URL_array) {
                // Regular Expression Based Implementation
                updatedHTML = html.replace(/%longLink%/g, el.longUrl);
                updatedHTML = updatedHTML.replace(/%num%/g, ++pass);
                updatedHTML = updatedHTML.replace(/%shortLink%/g, el.shortUrl);
                // inject to DOM
                $(main__element).insertAdjacentHTML('afterbegin', updatedHTML);
            }
        }
        else {
            $(clear__btn).style.display = 'none';
            $(main__element).insertAdjacentHTML('afterbegin', '<h2 class="py-2">Empty List</h2>');
        }

        // rating button
        updateRatingButton();

    } else {
        alert('Enable History from Options Page');
        browser.runtime.openOptionsPage();
    }
});


// Clear all history
$(clear__btn).on('click', async () => {
    await browser.storage.local.set({
        URL_array: []
    });
    $(main__element).parentNode.removeChild($(main__element));
    $(clear__btn).style.display = 'none';
    $(table).insertAdjacentHTML('beforeend', '<h2 class="py-2 table-inner">Empty List</h2>');
});


// Buttons Function
const buttonAction = async (type, id) => {

    const flashCopyAlert = (flashHTML) => {
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
        const html = '<div class="table__qrcodePopup--div" id="qrcode__template"><div class="table__qrcode--popup"><div class="table__qrcode--holder"><img id="table__qrcode" src="%qrcodeLink%" alt="QRCode" /></div><div class="table__closebtn--holder"><button type="button" class="table__closebtn--inner" id="close__btn-%num%">Close</button></div></div></div>';
        // 1. get short link
        const shortUrl = $(`#shortUrl-${id}`).textContent;
        // 2. generate qrcode
        try {
            const qrcodeURL = await QRCode.toDataURL(shortUrl);
            // 3. display popup menu with link
            updatedHTML = html.replace('%qrcodeLink%', qrcodeURL);
            updatedHTML = updatedHTML.replace('%num%', id);
            $(`#btns-${id}`).insertAdjacentHTML('afterend', updatedHTML);
        } catch (err) {
            // fetch qrcode from http://goqr.me
            const qrcode__api = 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=';
            updatedHTML = html.replace('%qrcodeLink%', `${qrcode__api}${shortUrl}`);
            $(`#btns-${id}`).insertAdjacentHTML('afterend', updatedHTML);
        }
    } 
    // clear all button
    else if (type === 'close__btn') {
        $('#qrcode__template').parentNode.removeChild($('#qrcode__template'));
    }
};


// get the delegation id
const getButtonDetails = (e) => {
    let splitId, type, id;
    const eventId = e.target.id;
    if (eventId) {
        splitId = eventId.split('-');
        type = splitId[0];
        id = parseInt(splitId[1]);
        // perform action
        buttonAction(type, id);
    }
};


// Button Action (qrcode / copy)
$(main__element).on('click', getButtonDetails);


// prevent enter key press
document.on('keypress', (e) => {
    const keyCode = e.which || e.keyCode;
    if (keyCode === 13) {
        e.preventDefault();
    }
});