import axios from "axios";
import browser from "../scripts/vendor/browser-polyfill";

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
        shortLink = rawData.data.shortUrl;

        // returns the promise
        console.log("Returning Promise!");
        return shortLink;
    } catch (error) {
        console.log(error); 
    }
};


// Calling function
browser.runtime.onMessage.addListener(async (request, sender, response) => {
    if(request.msg == "start") {
        // consume the promise
        return getShortURL(request.API_key, request.pageUrl, request.password)
            .then(shortLink => {
                console.log("URL:" + shortLink);
                return shortLink;
            })
            .catch(err => {
                console.log("Error Occured!");
            });
    }
});