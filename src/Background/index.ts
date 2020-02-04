/**
 *  @author abhijithvijayan <abhijithvijayan.in>
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { browser } from 'webextension-polyfill-ts';

import { AxiosPromise } from 'axios';
import { CHECK_API_KEY } from './constants';
import api from '../api';

function checkApiKey(apikey: string): AxiosPromise<any> {
    // fix-on-resolve: https://github.com/thedevs-network/kutt/issues/203#issuecomment-581740790
    return api({
        method: 'GET',
        url: '/api/v2/sample_endpoint',
        timeout: 8000,
        headers: {
            'X-API-Key': apikey,
        },
    });
}

browser.runtime.onMessage.addListener((request, sender): void | Promise<any> => {
    console.log('message received', request);
    // eslint-disable-next-line default-case
    switch (request.action) {
        case CHECK_API_KEY: {
            return checkApiKey(request.params.apikey);
        }
    }
});
