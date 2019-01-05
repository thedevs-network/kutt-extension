import axios from "axios";

async function getShortURL(URLtoShorten) {
    let shortLink;
    const api_url = 'https://kutt.it/api/url/submit';
    const API_key = "????????????????????????????????????";
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

chrome.runtime.onMessage.addListener(
    // receive the message
    (request, sender, sendResponse) => {
        if(request.msg == "start") {
            let shortLink;
            // consume the promise
            getShortURL(request.pageUrl).then((data) => {
                shortLink = data;
                sendResponse({ shortUrl: `${shortLink}` });
            });
            return true;
        }
    }
);