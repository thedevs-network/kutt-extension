/**
 *  @author abhijithvijayan <abhijithvijayan.in>
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { browser } from 'webextension-polyfill-ts';

import { AxiosPromise } from 'axios';
import * as constants from './constants';
import api from '../api';

export type ShortenUrlBodyProperties = {
    target: string;
    password: string;
    customurl: string;
    reuse: boolean;
    domain: string;
};

function shortenUrl(params: ShortenUrlBodyProperties): AxiosPromise<any> {
    // ToDo: get apikey from local storage
    return api({
        method: 'POST',
        timeout: constants.SHORTEN_URL_TIMEOUT,
        url: `/api/v2/links`,
        headers: {
            'X-API-Key': 'replace-with-api-key',
        },
        data: {
            ...params,
        },
    });
}

function getUserSettings(apikey: string): AxiosPromise<any> {
    return api({
        method: 'GET',
        url: '/api/v2/users',
        timeout: constants.CHECK_API_KEY_TIMEOUT,
        headers: {
            'X-API-Key': apikey,
        },
    });
}

async function checkApiKey(apikey: string): Promise<any> {
    try {
        const { data } = await getUserSettings(apikey);

        console.log(data);
    } catch (err) {
        if (err.response) {
            if (err.response.status === 401) {
                return 'Error: Invalid API Key';
            }

            return 'Error: Something went wrong.';
        }

        if (err.code === 'ECONNABORTED') {
            return 'Error: Timed out';
        }

        return 'Error: Please check your internet connection';
    }
}

/**
 *  Listen for messages from UI
 */
browser.runtime.onMessage.addListener((request, sender): void | AxiosPromise<any> => {
    console.log('message received', request);
    // eslint-disable-next-line default-case
    switch (request.action) {
        case constants.CHECK_API_KEY: {
            return checkApiKey(request.params.apikey);
        }

        case constants.SHORTEN_URL: {
            return shortenUrl(request.params);
        }
    }
});
