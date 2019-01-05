// update UI - API Key on options page load
document.addEventListener('DOMContentLoaded', () => {
    // replace the input value with current value on load
    chrome.storage.local.get(['key'], function(result) {
        document.getElementById('api__key--value').value = result.key;
    });
});

// Store new API Key
document.getElementById('button__submit').addEventListener('click', () => {
    let API_KEY = document.getElementById('api__key--value').value;
    // store value locally
    chrome.storage.local.set({key: API_KEY}, function() {
        console.log('Value is set to ' + API_KEY);
    });
});
