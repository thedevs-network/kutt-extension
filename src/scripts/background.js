import Kutt from 'kutt';
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
    
    const kutt = new Kutt();

    // configure kutt-package
    kutt.setAPI(API_HOST);
    kutt.setKey(API_KEY);
    kutt.setTimeout(20000);

    const data = {
        target: urlToShorten,
        password
    };

    // shorten function
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
        let count = curURLCollection.length;
        // find & remove duplicates
        curURLCollection.map(el => {
            console.log(el);
            if (el.longUrl === curURLPair.longUrl) {
                // pop the existing pair

                // decrement count
                --count;
            }
        });
        // delete first pair if size exceeds 10
        if (count >= 10) {
            curURLCollection.shift();
        }
        // push to the array
        curURLCollection.push(curURLPair);
        // save to local storage
        await browser.storage.local.set({
            URL_array: curURLCollection
        });
    }
});