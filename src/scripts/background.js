import Kutt from 'kutt';
import browser from 'webextension-polyfill';

// Shorten url
async function getShortURL(API_key, URLtoShorten, password) {
    const kutt = new Kutt();
    kutt.setKey(API_key);
    kutt.setTimeout(20000);

    const data = {
        target: URLtoShorten,
        password: password
    };

    try {
        const response = await kutt.submit(data);
        return response.shortUrl;
    } catch (e) {
        // time out
        if (e.code === 'ECONNABORTED') {
            return 504;
        }
        // return status code
        if (e.response) {
            return e.response.status;
        }
    }
}


// Calling function
browser.runtime.onMessage.addListener(async (request, sender, response) => {
// get the url shorten request from popup.js
    if (request.msg === 'start') {
        return await getShortURL(request.API_key, request.pageUrl, request.password);
    }
    // store urls to history
    if (request.msg === 'store') {
        const targetURLs = request.URL_array;
        const counter = targetURLs.length;
        if (counter >= 10) {
            // delete first element
            targetURLs.shift();
        }
        targetURLs.push(request.mix_URLs);
        await browser.storage.local.set({
            URL_array: targetURLs
        });
    }
});