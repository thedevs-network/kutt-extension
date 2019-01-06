let shortUrl;

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Pass the message and receive response
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
            
        let longUrl, start, qrcode__src = 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=';
        let API_key;

        longUrl = tabs[0].url;
        start = longUrl.substr(0, 6);
        
        // i) Get api key from options page
        chrome.storage.local.get(['key'], function(result) {

            API_key = result.key;
            
            if(start !== 'chrome' && API_key !== '' && API_key !== undefined) {
                // send start message to background.js and receive response
                chrome.runtime.sendMessage({ msg: "start", API_key: `${API_key}`, pageUrl: `${longUrl}` }, (response) => {
                    // store the shortened link
                    shortUrl = response.shortUrl;
                    // invalid response
                    if(shortUrl === 'undefined') {
                        document.getElementById('url__content-inner').textContent = "API Error!!";
                    } else {
                        // update the content with shortened link
                        document.getElementById('url__content-inner').textContent = shortUrl;
                        // fetch qrcode from http://goqr.me
                        document.getElementById('qr_code').src = `${qrcode__src}${shortUrl}`;
                        // show buttons                        
                        toggleDisplay('.buttons__content--holder');
                    }
                });
            }
            else if (start === 'chrome') {
                document.getElementById('url__content-inner').textContent = 'Not a Valid URL!!';
            }
            else if (API_key === '' || API_key === undefined) {
                // no api key set
                document.getElementById('url__content-inner').textContent = 'Set API Key in Settings!';
            }
            else {
                document.getElementById('url__content-inner').textContent = 'Error!!!';
            }

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
            toggleDisplay('.copy__alert');
            setTimeout(() => {
                toggleDisplay('.copy__alert');
            }, 1300);
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
        // document.getElementById('button__qrcode').style = "display: none;";
        toggleDisplay('.qrcode__content--holder');
    });

    
    // 5. elements visiblity function
    function toggleDisplay(className) {
        let element = document.querySelector(className);
        element.classList.toggle('d-none');
    }

});