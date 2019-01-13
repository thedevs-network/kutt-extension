import browser from "webextension-polyfill";

let shortUrl;

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialize
    browser.tabs.query({'active': true, 'lastFocusedWindow': true}).then(tabs => {
            
        let longUrl, start, qrcode__src = 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=';
        let API_key, password;

        longUrl = tabs[0].url;
        start = longUrl.substr(0, 4);
        
        // i) Get api key from options page
        browser.storage.local.get(['key', 'pwd']).then(result => {

            API_key = result.key;
            password = result.pwd;

            // update DOM
            let updateContent = (value) => {
                document.getElementById('url__content-inner').textContent = value;
            };    
            
            if(start === 'http' && API_key !== '' && API_key !== undefined) {
                
                // send start message to background.js and receive response
                browser.runtime.sendMessage({ msg: "start", API_key: `${API_key}`, pageUrl: `${longUrl}`, password: `${password}` }).then(response => {
                    // store the shortened link
                    shortUrl = response;

                    let statusCodes = [400, 401, 429];        

                    // invalid response
                    if (shortUrl === null) {
                        updateContent('Invalid Response!');
                    } else if (!isNaN(shortUrl)) {
                        if (shortUrl === 429) {
                            updateContent('API Limit Exceeded!');
                        } else if (shortUrl === 401) {
                            updateContent('Invalid API Key');
                        } else if (shortUrl === 400) {
                            updateContent('Link too Long! (Max length: 3000)');
                        } else {
                            updateContent('Unknown Error!!!');
                        }
                    } 
                    else {
                        // update the content with shortened link
                        updateContent(shortUrl);
                        // fetch qrcode from http://goqr.me
                        document.getElementById('qr_code').src = `${qrcode__src}${shortUrl}`;
                        // show buttons                        
                        toggleDisplay('.buttons__content--holder');
                    }
                });

            }
            else if (start !== 'http') {
                updateContent('Not a Valid URL!!');
            }
            else if (API_key === '' || API_key === undefined) {
                // no api key set
                updateContent('Set API Key in Options!');
            }

       });

    });


    // 2. Copy Function
    document.getElementById('button__copy--holder').addEventListener("click", () => {
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
    // document.getElementById('button__details').addEventListener('click', () => {
    //     let [id] = shortUrl.split('/').reverse();
    //     let win = window.open(`https://kutt.it/stats?id=${id}&domain=kutt.it`, '_blank');
    //     win.focus();
    // });


    // 4. QR Code
    document.getElementById('button__qrcode--holder').addEventListener('click', () => {
        toggleDisplay('.qrcode__content--holder');
    });

    
    // 5. elements visiblity function
    function toggleDisplay(className) {
        let element = document.querySelector(className);
        element.classList.toggle('d-none');
    }

});