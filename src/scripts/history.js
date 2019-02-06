import browser from 'webextension-polyfill';

// get longURL, shortURL
browser.storage.local.get(['URL_array', 'count']).then(result => {
    console.log(result.URL_array);
});

// update DOM

// copy button

// QR code gen

// clear all history