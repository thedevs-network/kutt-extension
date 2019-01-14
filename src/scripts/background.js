import axios from 'axios';
import browser from 'webextension-polyfill';

// Shorten url
async function getShortURL(API_key, URLtoShorten, password) {
    let shortLink;
    const api_url = 'https://kutt.it/api/url/submit';
    try {
        const json = await axios({
            method: 'POST',
            url: api_url,
            headers: {
                'X-API-Key': API_key
            },
            data: {
                target: URLtoShorten,
                password: password
            }
        });
        shortLink = json.data.shortUrl;
        // returns the promise
        return shortLink;
    }
    catch (error) {
        if (error.response) {
            // return error code
            return error.response.status;
        } 
    }
};


// Calling function
browser.runtime.onMessage.addListener(async (request, sender, response) => {
    if (request.msg == 'start') {
        // consume the promise
        return getShortURL(request.API_key, request.pageUrl, request.password)
            .then(shortLink => {
                return shortLink;
            });
    }
});