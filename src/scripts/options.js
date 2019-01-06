// update UI - API Key on options page load
document.addEventListener('DOMContentLoaded', () => {
    // replace the input value with current value on load
    chrome.storage.local.get(['key'], function(result) {
        // to string
        let API_KEY = `${result.key}`;
        if (API_KEY === 'undefined') {
            document.getElementById('api__key--value').value = '';
        } else {
            document.getElementById('api__key--value').value = API_KEY;
        }
    });
});


// Store new API Key on save click
document.getElementById('button__submit').addEventListener('click', () => {
    let API_KEY = document.getElementById('api__key--value').value;
    // store value locally
    chrome.storage.local.set({key: API_KEY}, function() {
        console.log('Value is set to ' + API_KEY);
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