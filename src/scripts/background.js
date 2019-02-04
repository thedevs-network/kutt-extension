import Kutt from 'kutt';
import browser from 'webextension-polyfill';

// Shorten url
async function getShortURL(API_key, URLtoShorten, password) {
    const kutt = new Kutt();
    kutt.setKey(API_key);

    const data = {
        target: URLtoShorten,
        password: password
    };

    try{
        const response = await kutt.submit(data);

        // Returning shortlink
        return response.shortUrl;
    }catch (e) {
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
    if (request.msg == 'start') {
        // consume the promise
        return getShortURL(request.API_key, request.pageUrl, request.password)
            .then(shortLink => {
                return shortLink;
            });
    }
});