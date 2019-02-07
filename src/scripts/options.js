import browser from 'webextension-polyfill';

// update UI - API Key on options page load
document.addEventListener('DOMContentLoaded', () => {
    // replace the input value with current value on load
    browser.storage.local.get(['key', 'pwd']).then(result => {
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


// Store Data and alert message
let saveData = () => {
    let API_KEY = document.getElementById('api__key--value').value;
    let password = document.getElementById('password--value').value;
    let emptyArray = [];

    // store value locally
    browser.storage.local.set({ key: API_KEY, pwd: password, URL_array: emptyArray, count: 0 }).then(() => {
        // Saved Alert
        let element = document.querySelector('.saved__alert');
        element.classList.toggle('v-none');
        setTimeout(() => {
            element.classList.toggle('v-none');
            // close current tab
            browser.tabs.getCurrent().then((tabInfo) => {
                browser.tabs.remove(tabInfo.id);
            });
        }, 1250);
    });
};


// on save button click
document.getElementById('button__submit').addEventListener('click', () => {
    saveData();
});


// on enter key press
document.addEventListener('keypress', (e) => {
    if (e.keyCode === 13) {
        saveData();
    }
});


// Show Password
document.getElementById('password__view--checkbox').addEventListener('click', () => {
    let element = document.getElementById('password--value');
    if (element.type === 'password') {
        element.type = 'text';
    } else {
        element.type = 'password';
    }
});