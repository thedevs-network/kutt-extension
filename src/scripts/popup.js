document.addEventListener('DOMContentLoaded', () => {
    
    let longUrl, shortUrl;

    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
       longUrl = tabs[0].url;
       chrome.runtime.sendMessage({ msg: "start", pageUrl: `${longUrl}` }, (response) => {
           console.log(response);
           console.log(response.shortUrl); 
           shortUrl = response.shortUrl;
           document.getElementById('text').textContent = shortUrl;
        });
    });
});