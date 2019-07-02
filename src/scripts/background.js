import axios from 'axios';
import browser from 'webextension-polyfill';

// Shorten url
const shortenUrl = async (API_KEY, urlToShorten, password) => {
    let API_HOST = 'https://kutt.it';

    try {
        const { host, userOptions } = await browser.storage.local.get(['host', 'userOptions']);
        if (userOptions.hasOwnProperty('devMode') && userOptions.devMode) {
            API_HOST = host;
        }
        // else use default host
    }
    catch (e) {
        // do something if fetching from localstorage fails
        API_HOST = 'https://kutt.it';
    }

    // shorten function
    try {
        const { data: { shortUrl } } = await axios({
            method: 'POST',
            timeout: 20000,
            url: `${API_HOST}/api/url/submit`,
            headers: {
                'X-API-Key': API_KEY
            },
            data: {
                target: urlToShorten,
                password
            }
        });
        return shortUrl;

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
};


// Calling function
browser.runtime.onMessage.addListener(async (request, sender, response) => {
    // shorten request
    if (request.msg === 'start') {
        return await shortenUrl(request.API_key, request.pageUrl, request.password);
    }
    // store urls to history
    if (request.msg === 'store') {
        const curURLCollection = request.curURLCollection;
        const curURLPair = request.curURLPair;
        // find & remove duplicates
        const noDuplicateArray = curURLCollection.filter(el => el.longUrl !== curURLPair.longUrl);
        let count = noDuplicateArray.length;
        // delete first pair if size exceeds 10
        if (count >= 10) {
            noDuplicateArray.shift();
        }
        // push to the array
        noDuplicateArray.push(curURLPair);
        // save to local storage
        await browser.storage.local.set({
            URL_array: noDuplicateArray
        });
    }
});