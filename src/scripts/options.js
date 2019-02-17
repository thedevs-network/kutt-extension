import browser from 'webextension-polyfill';


const pwd__holder = document.getElementById('pwd__holder'),
    submit__btn = document.getElementById('button__submit'),
    pwd__value = document.getElementById('password--value'),
    api__holder = document.getElementById('api__key--value'),
    pwd__view = document.getElementById('view__password--eye'),
    pwd__switch = document.getElementById('password__label--switch'),
    pwd__checkbox = document.getElementById('password__label--checkbox'),
    history__checkbox = document.getElementById('history__label--checkbox'),
    autocopy__checkbox = document.getElementById('autocopy__label--checkbox');


// update UI - API Key on options page load
document.addEventListener('DOMContentLoaded', () => {
    // replace the input value with current value on load
    browser.storage.local.get(['key', 'pwd', 'userOptions'])
        .then(result => {
            // to string
            const API_KEY = `${result.key}`;
            let pwd = result.pwd;
            if (API_KEY === 'undefined') {
                api__holder.value = '';
            } else {
                api__holder.value = API_KEY;
                pwd__checkbox.checked = result.userOptions.pwdForUrls;
                // if disabled -> delete save password
                if (!result.userOptions.pwdForUrls) {
                    pwd = '';
                }
                pwd__value.value = pwd;
                // view password holder
                toggleView(result.userOptions.pwdForUrls);
            }
            autocopy__checkbox.checked = result.userOptions.autoCopy;
            history__checkbox.checked = result.userOptions.keepHistory;
        });
});


// Store Data and alert message
const saveData = () => {
    let password = pwd__value.value;
    const API_KEY = api__holder.value;
    let pwdForUrls = pwd__checkbox.checked;
    const autoCopy = autocopy__checkbox.checked;
    const keepHistory = history__checkbox.checked;

    if (password == '') {
        pwdForUrls = false;
    }
    if (!pwdForUrls) {
        password = '';
    }

    const userOptions = {
        pwdForUrls: pwdForUrls,
        autoCopy: autoCopy,
        keepHistory: keepHistory
    };

    // store value locally
    browser.storage.local.set({ key: API_KEY, pwd: password, URL_array: [], userOptions: userOptions }).then(() => {
        // Saved Alert
        submit__btn.textContent = 'Saved!';
        setTimeout(() => {
            submit__btn.textContent = 'Save';
            // close current tab
            browser.tabs.getCurrent().then((tabInfo) => {
                browser.tabs.remove(tabInfo.id);
            });
        }, 1250);
    });
};


// on save button click
submit__btn.addEventListener('click', saveData);


// on enter key press
document.addEventListener('keypress', (e) => {
    if (e.keyCode === 13) {
        saveData();
    }
});


// Show Password
pwd__view.addEventListener('click', () => {
    const element = pwd__value;
    if (element.type === 'password') {
        element.type = 'text';
        pwd__view.textContent = 'HIDE';
    } else {
        element.type = 'password';
        pwd__view.textContent = 'SHOW';
    }
});


// Password Holder View Toggle
function toggleView(checked) {
    if (checked) {
        pwd__holder.classList.remove('d-none');
    } else {
        pwd__holder.classList.add('d-none');
    }
}


// Password Option toggle key press
pwd__switch.addEventListener('click', () => {
    const checked = pwd__checkbox.checked;
    toggleView(checked);
});