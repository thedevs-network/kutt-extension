document.addEventListener('DOMContentLoaded', () => {
    
    let longUrl, shortUrl;

    // 1. Pass the message and receive response
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
       longUrl = tabs[0].url;
       chrome.runtime.sendMessage({ msg: "start", pageUrl: `${longUrl}` }, (response) => {
           console.log(response);
           console.log(response.shortUrl); 
           shortUrl = response.shortUrl;
           document.getElementById('text').textContent = shortUrl;
        });
    });

    // 2. Copy Function
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

    // 3. Details button
    document.getElementById('button__details').addEventListener('click', () => {
        let win = window.open(`${shortUrl}+`, '_blank');
        win.focus();
    });


});