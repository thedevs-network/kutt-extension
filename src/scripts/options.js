import { $, $$ } from './bling';
import browser from 'webextension-polyfill';

// constants
const pwd__holder = '#pwd__holder',
    dev__holder = '#developer__holder',
    submit__btn = '#button__submit',
    pwd__value = '#password--value',
    dev__value = '#developer__mode--value',
    api__holder = '#api__key--value',
    pwd__eye = '#view__password--eye',
    pwd__switch = '#password__label--switch',
    dev__switch = '#developer__label--switch',
    pwd__checkbox = '#password__label--checkbox',
    dev__checkbox = '#developer__label--checkbox',
    history__checkbox = '#history__label--checkbox',
    autocopy__checkbox = '#autocopy__label--checkbox';


document.on('DOMContentLoaded', async () => {
    let { key, pwd, userOptions, host } = await browser.storage.local.get(['key', 'pwd', 'userOptions', 'host']);
    // apikey to string
    const API_KEY = `${key}`;
    if (API_KEY === 'undefined') {
        $(api__holder).value = '';
    } else {
        $(api__holder).value = API_KEY;
        // password holder
        $(pwd__checkbox).checked = userOptions.pwdForUrls;
        // if disabled -> delete save password
        if (!userOptions.pwdForUrls) {
            pwd = '';
        }
        $(pwd__value).value = pwd;
        toggleInputVisibility(userOptions.pwdForUrls, pwd__holder);
        // dev mode holder
        $(dev__checkbox).checked = userOptions.devMode;
        if (!userOptions.devMode) {
            host = '';
        }
        $(dev__value).value = host;
        toggleInputVisibility(userOptions.devMode, dev__holder);
    }
    $(autocopy__checkbox).checked = userOptions.autoCopy;
    $(history__checkbox).checked = userOptions.keepHistory;
});


// Store Data and Alert message
const saveData = async () => {

    let password = $(pwd__value).value;
    let API_HOST = $(dev__value).value;
    const API_KEY = $(api__holder).value;

    let devMode = $(dev__checkbox).checked;
    let pwdForUrls = $(pwd__checkbox).checked;
    const autoCopy = $(autocopy__checkbox).checked;
    const keepHistory = $(history__checkbox).checked;

    if (password == '') {
        pwdForUrls = false;
    }
    if (!pwdForUrls) {
        password = '';
    }
    if (API_HOST == '') {
        devMode = false;
    }
    if (!devMode) {
        API_HOST = '';
    }

    const userOptions = {
        pwdForUrls,
        autoCopy,
        devMode,
        keepHistory
    };

    // store value locally
    await browser.storage.local.set({
        key: API_KEY,
        pwd: password,
        host: API_HOST,
        URL_array: [],
        userOptions: userOptions
    });

    $(submit__btn).textContent = 'Saved';
    setTimeout(async () => {
        $(submit__btn).textContent = 'Save';
        // close current tab
        const tabInfo = await browser.tabs.getCurrent();
        browser.tabs.remove(tabInfo.id);
    }, 1250);
};


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


function toggleInputVisibility(checked, el) {
    if (checked) {
        $(el).classList.remove('d-none');
    } else {
        $(el).classList.add('d-none');
    }
}


// Password Enable/Disable Switch
$(pwd__switch).on('click', () => {
    const checked = $(pwd__checkbox).checked;
    toggleInputVisibility(checked, pwd__holder);
});


// Developer Mode Enable/Disable Switch
$(dev__switch).on('click', () => {
    const checked = $(dev__checkbox).checked;
    toggleInputVisibility(checked, dev__holder);
});