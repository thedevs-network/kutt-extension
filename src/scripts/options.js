/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import browser from 'webextension-polyfill';

import {
    pwd__holder,
    dev__holder,
    submit__btn,
    pwd__value,
    dev__value,
    api__holder,
    pwd__eye,
    pwd__switch,
    dev__switch,
    pwd__checkbox,
    dev__checkbox,
    history__checkbox,
    autocopy__checkbox,
} from './constants';
import { $ } from './bling';

document.on('DOMContentLoaded', async () => {
    // get values from localstorage
    let { key, pwd, userOptions, host } = await browser.storage.local.get(['key', 'pwd', 'userOptions', 'host']);

    // don't use toString() as it will fail for `undefined`
    const API_KEY = `${key}`;

    if (API_KEY === 'undefined') {
        $(api__holder).value = '';
    } else {
        $(api__holder).value = API_KEY;

        // password holder
        $(pwd__checkbox).checked = userOptions.pwdForUrls;

        // if disabled -> delete saved password
        if (!userOptions.pwdForUrls) {
            pwd = '';
        }

        $(pwd__value).value = pwd;
        toggleInputVisibility(userOptions.pwdForUrls, pwd__holder);

        // dev mode holder
        $(dev__checkbox).checked = userOptions.devMode;

        // if disabled -> reset to default host
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

    if (password === '') {
        pwdForUrls = false;
    }

    if (!pwdForUrls) {
        password = '';
    }

    if (API_HOST === '') {
        devMode = false;
    } else if (API_HOST.endsWith('/')) {
        API_HOST = API_HOST.slice(0, -1);
    }

    if (!devMode) {
        API_HOST = '';
    }

    const userOptions = {
        pwdForUrls,
        autoCopy,
        devMode,
        keepHistory,
    };

    // store value locally
    await browser.storage.local.set({
        key: API_KEY,
        pwd: password,
        host: API_HOST,
        URL_array: [],
        userOptions,
    });

    $(submit__btn).textContent = 'Saved';

    setTimeout(async () => {
        $(submit__btn).textContent = 'Save';

        // close current tab
        const tabInfo = await browser.tabs.getCurrent();
        browser.tabs.remove(tabInfo.id);
    }, 1250);
};

/**
 *  Handle submit button click
 */
$(submit__btn).on('click', saveData);

/**
 *  Handle enter-key press
 */
document.on('keypress', e => {
    if (e.keyCode === 13) {
        saveData();
    }
});

/**
 *  Toggle Password View
 */
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

/**
 *  Toggle Element Visibility
 */
function toggleInputVisibility(checked, el) {
    if (checked) {
        $(el).classList.remove('d-none');
    } else {
        $(el).classList.add('d-none');
    }
}

/**
 *  Password Enable/Disable Switch
 */
$(pwd__switch).on('click', () => {
    const { checked } = $(pwd__checkbox);

    toggleInputVisibility(checked, pwd__holder);
});

/**
 *  Customhost Mode Enable/Disable Switch
 */
$(dev__switch).on('click', () => {
    const { checked } = $(dev__checkbox);

    toggleInputVisibility(checked, dev__holder);
});
