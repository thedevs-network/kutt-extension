/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import browser from 'webextension-polyfill';

import {
    PASSWORD_HOLDER,
    CUSTOM_HOST_URL_HOLDER,
    SAVE_BUTTON,
    PASSWORD_INPUT,
    CUSTOM_HOST_URL_INPUT,
    API_KEY_INPUT,
    PASSWORD_VIEW_TOGGLER,
    PASSWORD_INPUT_TOGGLE_SWITCH,
    CUSTOM_HOST_INPUT_TOGGLE_SWITCH,
    PASSWORD_OPTION_CHECKBOX,
    CUSTOM_HOST_OPTION_CHECKBOX,
    SAVE_HISTORY_OPTION_CHECKBOX,
    AUTOCOPY_OPTION_CHECKBOX,
} from './constants';
import { $ } from './bling';

document.on('DOMContentLoaded', async () => {
    // get values from localstorage
    let { key, pwd, userOptions, host } = await browser.storage.local.get(['key', 'pwd', 'userOptions', 'host']);

    // don't use toString() as it will fail for `undefined`
    const API_KEY = `${key}`;

    if (API_KEY === 'undefined') {
        $(API_KEY_INPUT).value = '';
    } else {
        $(API_KEY_INPUT).value = API_KEY;

        // password holder
        $(PASSWORD_OPTION_CHECKBOX).checked = userOptions.pwdForUrls;

        // if disabled -> delete saved password
        if (!userOptions.pwdForUrls) {
            pwd = '';
        }

        $(PASSWORD_INPUT).value = pwd;
        toggleInputVisibility(userOptions.pwdForUrls, PASSWORD_HOLDER);

        // dev mode holder
        $(CUSTOM_HOST_OPTION_CHECKBOX).checked = userOptions.devMode;

        // if disabled -> reset to default host
        if (!userOptions.devMode) {
            host = '';
        }

        $(CUSTOM_HOST_URL_INPUT).value = host;
        toggleInputVisibility(userOptions.devMode, CUSTOM_HOST_URL_HOLDER);
    }

    $(AUTOCOPY_OPTION_CHECKBOX).checked = userOptions.autoCopy;
    $(SAVE_HISTORY_OPTION_CHECKBOX).checked = userOptions.keepHistory;
});

// Store Data and Alert message
const saveData = async () => {
    let password = $(PASSWORD_INPUT).value;
    let API_HOST = $(CUSTOM_HOST_URL_INPUT).value;
    const API_KEY = $(API_KEY_INPUT).value;

    let devMode = $(CUSTOM_HOST_OPTION_CHECKBOX).checked;
    let pwdForUrls = $(PASSWORD_OPTION_CHECKBOX).checked;
    const autoCopy = $(AUTOCOPY_OPTION_CHECKBOX).checked;
    const keepHistory = $(SAVE_HISTORY_OPTION_CHECKBOX).checked;

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

    $(SAVE_BUTTON).textContent = 'Saved';

    setTimeout(async () => {
        $(SAVE_BUTTON).textContent = 'Save';

        // close current tab
        const tabInfo = await browser.tabs.getCurrent();
        browser.tabs.remove(tabInfo.id);
    }, 1250);
};

/**
 *  Handle submit button click
 */
$(SAVE_BUTTON).on('click', saveData);

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
$(PASSWORD_VIEW_TOGGLER).on('click', () => {
    const element = $(PASSWORD_INPUT);

    if (element.type === 'password') {
        element.type = 'text';
        $(PASSWORD_VIEW_TOGGLER).textContent = 'HIDE';
    } else {
        element.type = 'password';
        $(PASSWORD_VIEW_TOGGLER).textContent = 'SHOW';
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
$(PASSWORD_INPUT_TOGGLE_SWITCH).on('click', () => {
    const { checked } = $(PASSWORD_OPTION_CHECKBOX);

    toggleInputVisibility(checked, PASSWORD_HOLDER);
});

/**
 *  Customhost Mode Enable/Disable Switch
 */
$(CUSTOM_HOST_INPUT_TOGGLE_SWITCH).on('click', () => {
    const { checked } = $(CUSTOM_HOST_OPTION_CHECKBOX);

    toggleInputVisibility(checked, CUSTOM_HOST_URL_HOLDER);
});
