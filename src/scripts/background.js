import axios from "axios";

async function getShortURL(URLtoShorten) {
    let shortLink;
    const API_key = "????????????????????????????";
    console.log(URLtoShorten);
    try {
        const rawData = await axios({
            method: "POST",
            url:
            "https://kutt.it/api/url/submit",
            headers: { 
                'X-API-Key': API_key 
            },
            data: { target: URLtoShorten }
        });
        shortLink = rawData.data.shortUrl;
        console.log(shortLink);
    } catch (error) {
        console.log(error);
    }
    return shortLink;
};

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        let shortLink;

        if(request.msg == "start") {
            getShortURL(request.pageUrl).then((data) => {
                shortLink = data;
                console.log("short url = "+ shortLink);
            });
            console.log(`return link ${shortLink}`);
            sendResponse({ shortUrl: `${shortLink}` });
            // sendResponse({ shortUrl: `${shortLink}` });
        }
    }
);