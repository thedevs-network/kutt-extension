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

    document.getElementById('button__copy').addEventListener("click", () => {
        try {
            let copyTextarea = `${shortUrl}`;
            let input = document.createElement('textarea');
            document.body.appendChild(input);
            input.value = copyTextarea;
            input.focus();
            input.select();
            document.execCommand('copy');
            input.remove();    
        } 
        catch (error) {
          console.log('Oops, unable to copy');
        }
    });


});