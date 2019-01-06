import axios from "axios";

// Shorten url
async function getShortURL(API_key, URLtoShorten) {
    let shortLink;
    const api_url = 'https://cors-anywhere.herokuapp.com/https://kutt.it/api/url/submit';
    try {
        const rawData = await axios({
            method: "POST",
            url: api_url,
            headers: { 
                'X-API-Key': API_key 
            },
            data: { target: URLtoShorten }
        });
        shortLink = rawData.data.shortUrl;
    } catch (error) {
        console.log(error); 
    }
    // returns the promise
    return shortLink;
};

// Calling function
chrome.runtime.onMessage.addListener(
    // receive the message
    (request, sender, sendResponse) => {
        if(request.msg == "start") {
            let shortLink;
            // consume the promise
            getShortURL(request.API_key, request.pageUrl).then((data) => {
                shortLink = data;
                sendResponse({ shortUrl: `${shortLink}` });
            });
            return true;
        }
    }
);