import browser from 'webextension-polyfill';
import QRCode from 'qrcode';

let shortUrl;

document.addEventListener('DOMContentLoaded', () => {

    // 1. Initialize
    browser.tabs.query({ 'active': true, 'lastFocusedWindow': true }).then(tabs => {

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

            if (start === 'http' && API_key !== '' && API_key !== undefined) {

                // send start message to background.js and receive response
                browser.runtime.sendMessage({ msg: 'start', API_key: `${API_key}`, pageUrl: `${longUrl}`, password: `${password}` }).then(response => {
                    // store the shortened link
                    shortUrl = response;
                    // status codes
                    if (!isNaN(shortUrl)) {
                        if (shortUrl === 429) {
                            updateContent('API Limit Exceeded!');
                        } else if (shortUrl === 401) {
                            updateContent('Invalid API Key');
                            // } else if (shortUrl === 400) {
                            //     updateContent('Unknown Error!!!');
                        } else if (shortUrl === 504) {
                            updateContent('Time-out!');
                        } else {
                            updateContent('Unknown Error!!!');
                        }
                    }
                    // valid response
                    else if (shortUrl !== null) {
                        // 1. update the content with shortened link
                        updateContent(shortUrl);
                        // 2. show buttons                        
                        toggleDisplay('.buttons__content--holder');
                        // 3. QR Code Generation
                        QRCode.toDataURL(shortUrl)
                            .then(url => {
                                document.getElementById('qr_code').src = url;
                            })
                            .catch(err => {
                                // fetch qrcode from http://goqr.me
                                document.getElementById('qr_code').src = `${qrcode__src}${shortUrl}`;
                            });
                    }
                    else {
                        updateContent('Invalid Response!');
                    }
                });

            }
            else if (API_key === '' || API_key === undefined) {
                // no api key set
                updateContent('Set API Key in Options!');
                // open options page
                setTimeout(() => {
                    browser.runtime.openOptionsPage();
                }, 900);

            }
            else if (start !== 'http') {
                updateContent('Not a Valid URL!!');
            }

        });

    });


    // 2. Copy Function
    document.getElementById('button__copy--holder').addEventListener('click', () => {
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
            // console.log('Oops, unable to copy');
        }
    });


    // 3. QR Code
    document.getElementById('button__qrcode--holder').addEventListener('click', () => {
        toggleDisplay('.qrcode__content--holder');
    });


    // 4. elements visiblity function
    function toggleDisplay(className) {
        let element = document.querySelector(className);
        element.classList.toggle('d-none');
    }

});