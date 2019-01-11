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
        return shortLink;
    } catch (error) {
        // https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            // return error code
            return error.response.status;
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        console.log(error.config);
    }
};


// Calling function
browser.runtime.onMessage.addListener(async (request, sender, response) => {
    if(request.msg == "start") {
        // consume the promise
        return getShortURL(request.API_key, request.pageUrl, request.password)
            .then(shortLink => {
                return shortLink;
            })
            .catch(err => {
                console.log("Error Occured!");
            });
    }
});