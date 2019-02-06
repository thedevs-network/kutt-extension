import Kutt from 'kutt';
import browser from 'webextension-polyfill';

let count = 0, sample = [];

// Shorten url
async function getShortURL(API_key, URLtoShorten, password) {
    const kutt = new Kutt();
    kutt.setKey(API_key);

    const data = {
        target: URLtoShorten,
        password: password
    };

    try {
        const response = await kutt.submit(data);
        // Returning shortlink
        return response.shortUrl;
    } catch (e) {
        // time out
        if (e.code === 'ECONNABORTED') {
            return 504;
        }
        else if (e.response) {
            // return error code
            return e.response.status;
        }
    }
}


// Calling function
browser.runtime.onMessage.addListener(async (request, sender, response) => {
    // get the url shorten request from popup.js
    if (request.msg === 'start') {
        // consume the promise
        return getShortURL(request.API_key, request.pageUrl, request.password)
            .then(shortLink => {
                return shortLink;
            });
    }
    // store urls to history
    if (request.msg === 'store') {
        // get the object
        console.log(request.URLs);
        console.log(count);
        // sample.push(request.URLs);
        if (count >= 3) {
            // delete first element
            sample.shift();
            --count;
            browser.storage.local.set({ count: count });
        }
        if (count < 3) {
            sample.push(request.URLs);
            browser.storage.local.set({ URL_array: sample, count: ++count });
            console.log(sample);
        } 
        // store upto 10
        // console.log(count);
    }


});