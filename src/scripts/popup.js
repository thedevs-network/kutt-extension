document.addEventListener('DOMContentLoaded', () => {
    
    let longUrl, shortUrl, start, qrSrc = 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=';

    // 1. Pass the message and receive response
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
       longUrl = tabs[0].url;
       start = longUrl.substr(0, 6);
       if(start !== 'chrome') {
           // send start message to background.js and accept response
           chrome.runtime.sendMessage({ msg: "start", pageUrl: `${longUrl}` }, (response) => {
               // store the shortened link
               shortUrl = response.shortUrl;
               // update the content with shortened link
               document.getElementById('text').textContent = shortUrl;
               // fetch qrcode from http://goqr.me
               document.getElementById('qr_code').src = `${qrSrc}${shortUrl}`;
               // show buttons
               show('button__copy');
               show('button__details');
               show('button__qrcode');
            });
       } else {
        document.getElementById('text').textContent = 'Not Valid URL!!';
       }
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

    // 4. QR Code
    document.getElementById('button__qrcode').addEventListener('click', () => {
        document.getElementById('button__qrcode').style = "display: none;";
        show('qr_code');
    });

    // 5. elements visiblity function
    function show(param) {
        document.getElementById(param).style = '';
    }
});