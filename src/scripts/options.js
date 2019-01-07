// update UI - API Key on options page load
document.addEventListener('DOMContentLoaded', () => {
    // replace the input value with current value on load
    chrome.storage.local.get(['key', 'pwd'], function(result) {
        // to strings
        let API_KEY = `${result.key}`, pwd = `${result.pwd}`;
        if (API_KEY === 'undefined') {
            document.getElementById('api__key--value').value = '';
        } else {
            document.getElementById('api__key--value').value = API_KEY;
            document.getElementById('password--value').value = pwd;
        }
    });
});


// Store new API Key on save click
document.getElementById('button__submit').addEventListener('click', () => {
    let API_KEY = document.getElementById('api__key--value').value;
    let password = document.getElementById('password--value').value;

    if(!password) {
        console.log("No password Set");
    }
    // store value locally
    chrome.storage.local.set({key: API_KEY, pwd: password}, function() {
        console.log('API Key set to ' + API_KEY);
    });
});

// Saved Alert
document.getElementById('button__submit').addEventListener('click', () => {
    let element = document.querySelector('.saved__alert');
    element.classList.toggle('v-none');
    setTimeout(() => {
        element.classList.toggle('v-none');
    }, 1300);
});