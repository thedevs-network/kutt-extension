document.addEventListener('DOMContentLoaded', () => {
    
    let longUrl;

    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
       longUrl = tabs[0].url;
       chrome.runtime.sendMessage({ msg: "start", pageUrl: `${longUrl}` }, (response) => {
           console.log(response);
           console.log(response.shortUrl);  
        });
    });


    // let link = document.getElementById('text');
    // link.addEventListener('click', function() {
    //     console.log(bgpage);
    //     link.textContent = longUrl;
    // });
});