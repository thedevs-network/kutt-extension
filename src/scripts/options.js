import { $, $$ } from './bling';
import browser from 'webextension-polyfill';


const pwd__holder = '#pwd__holder',
    submit__btn = '#button__submit',
    pwd__value = '#password--value',
    api__holder = '#api__key--value',
    pwd__eye = '#view__password--eye',
    pwd__switch = '#password__label--switch',
    pwd__checkbox = '#password__label--checkbox',
    history__checkbox = '#history__label--checkbox',
    autocopy__checkbox = '#autocopy__label--checkbox';


document.on('DOMContentLoaded', () => {
    browser.storage.local.get(['key', 'pwd', 'userOptions'])
        .then(result => {
            // to string
            const API_KEY = `${result.key}`;
            let pwd = result.pwd;
            if (API_KEY === 'undefined') {
                $(api__holder).value = '';
            } else {
                $(api__holder).value = API_KEY;
                $(pwd__checkbox).checked = result.userOptions.pwdForUrls;
                // if disabled -> delete save password
                if (!result.userOptions.pwdForUrls) {
                    pwd = '';
                }
                $(pwd__value).value = pwd;
                toggleView(result.userOptions.pwdForUrls);
            }
            $(autocopy__checkbox).checked = result.userOptions.autoCopy;
            $(history__checkbox).checked = result.userOptions.keepHistory;
        });
});


// Store Data and Alert message
const saveData = () => {
    let password = $(pwd__value).value;
    const API_KEY = $(api__holder).value;
    let pwdForUrls = $(pwd__checkbox).checked;
    const autoCopy = $(autocopy__checkbox).checked;
    const keepHistory = $(history__checkbox).checked;

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
    browser.storage.local.set({
        key: API_KEY,
        pwd: password,
        URL_array: [],
        userOptions: userOptions
    }).then(() => {
        $(submit__btn).textContent = 'Saved';
        setTimeout(() => {
            $(submit__btn).textContent = 'Save';
            // close current tab
            browser.tabs.getCurrent().then((tabInfo) => {
                browser.tabs.remove(tabInfo.id);
            });
        }, 1250);
    });
};

// Save Data
$(submit__btn).on('click', saveData);

document.on('keypress', (e) => {
    if (e.keyCode === 13) {
        saveData();
    }
});


// Show Password
$(pwd__eye).on('click', () => {
    const element = $(pwd__value);
    if (element.type === 'password') {
        element.type = 'text';
        $(pwd__eye).textContent = 'HIDE';
    } else {
        element.type = 'password';
        $(pwd__eye).textContent = 'SHOW';
    }
});


// Toggle Password Holder View
function toggleView(checked) {
    if (checked) {
        $(pwd__holder).classList.remove('d-none');
    } else {
        $(pwd__holder).classList.add('d-none');
    }
}


// Password Enable/Disable Switch
$(pwd__switch).on('click', () => {
    const checked = $(pwd__checkbox).checked;
    toggleView(checked);
});