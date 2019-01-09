import axios from "axios";
import browser from "webextension-polyfill";

// Shorten url
async function getShortURL(API_key, URLtoShorten, password) {
    let shortLink;
    const api_url = 'https://kutt.it/api/url/submit';
    try {
        const rawData = await axios({
            method: "POST",
            url: api_url,
            headers: { 
                'X-API-Key': API_key 
            },
            data: { 
                target: URLtoShorten, 
                password: password
            }
        });
        // console.log(rawData);
        shortLink = rawData.data.shortUrl;
    } catch (error) {
        console.log(error); 
    }
    // returns the promise
    return shortLink;
};

// Calling function
browser.runtime.onMessage.addListener(
    // receive the message
    (request, sender, sendResponse) => {
        if(request.msg == "start") {
            let shortLink;
            // consume the promise
            getShortURL(request.API_key, request.pageUrl, request.password).then((data) => {
                shortLink = data;
                console.log(shortLink);
                sendResponse({ shortUrl: `${shortLink}` });
            });
            return true;
        }
    }
);