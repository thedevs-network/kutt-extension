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

function checkApiKey(apikey: string): AxiosPromise<any> {
    // fix-on-resolve: https://github.com/thedevs-network/kutt/issues/203#issuecomment-581740790
    return api({
        method: 'GET',
        url: '/api/v2/sample_endpoint',
        timeout: constants.CHECK_API_KEY_TIMEOUT,
        headers: {
            'X-API-Key': apikey,
        },
    });
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
