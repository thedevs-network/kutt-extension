import browser from 'webextension-polyfill';


// on page load
document.addEventListener('DOMContentLoaded', () => {
    let updatedHTML, html = '<tr class="table__body--holder"><td class="table__body--original"><a href="%longLink%" class="table__body--originalURL" target="_blank" rel="noopener">%longLink%</a></td><td class="table__body--shortened"><div class="table__body--shortenBody"><button class="table__body--copyBtn" title="Copy"><img id="" class="selectDisable icon__img" src="assets/copy.svg" alt="copy" /></button><a href="%shortLink%" class="table__body--shortenURL" target="_blank" rel="noopener">%shortLink%</a></div></td><td class="table__body--functionBtns"><div class="table__body--btnHolder"><button class="table__body--qrcode" title="QR Code"><img id="" class="selectDisable icon__img" src="assets/qrcode.svg" alt="QR Code" /></button><button class="table__body--delete" title="Delete"><img id="" class="selectDisable icon__img" src="assets/delete.svg" alt="Delete" /></button></div></td></tr>';
    // get longURL, shortURL
    browser.storage.local.get(['URL_array', 'count']).then(result => {
        // console.log(result.URL_array);
        // update DOM
        for (let el of result.URL_array) {             
            // Regular Expression Based Implementation
            updatedHTML = html.replace(/%longLink%/g, el.longUrl);
            updatedHTML = updatedHTML.replace(/%shortLink%/g, el.shortUrl);
            // inject to DOM
            document.querySelector('.table__content--body').insertAdjacentHTML('afterbegin', updatedHTML);
        }
    });
});

// copy button

// QR code gen

// clear all history