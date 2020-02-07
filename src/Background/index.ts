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
    password?: string;
    customurl?: string;
    reuse: boolean;
    domain: string;
};

type ShortenLinkResponseProperties = {
    id: string;
    address: string;
    banned: boolean;
    password: boolean;
    target: string;
    visit_count: number;
    created_at: string;
    updated_at: string;
    link: string;
};

export type ApiErroredProperties = {
    error: true;
    message: string;
};

export type SuccessfulShortenStatusProperties = {
    error: false;
    data: ShortenLinkResponseProperties;
};

async function shortenUrl(
    params: ShortenUrlBodyProperties
): Promise<SuccessfulShortenStatusProperties | ApiErroredProperties> {
    try {
        // ToDo: get apikey from local storage
        const { data }: { data: ShortenLinkResponseProperties } = await api({
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

        return {
            error: false,
            data,
        };
    } catch (err) {
        if (err.response) {
            if (err.response.status === 401) {
                return {
                    error: true,
                    message: 'Error: Invalid API Key',
                };
            }
        }

        if (err.code === 'ECONNABORTED') {
            return {
                error: true,
                message: 'Error: Timed out',
            };
        }

        return {
            error: true,
            message: 'Error: Something went wrong',
        };
    }
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

export type DomainEntryProperties = {
    address: string;
    banned: boolean;
    created_at: string;
    id: string;
    homepage: string;
    updated_at: string;
};

export type UserSettingsResponseProperties = {
    apikey: string;
    email: string;
    domains: DomainEntryProperties[];
};

export type SuccessfulApiKeyCheckProperties = {
    error: false;
    data: UserSettingsResponseProperties;
};

async function checkApiKey(apikey: string): Promise<SuccessfulApiKeyCheckProperties | ApiErroredProperties> {
    try {
        const { data }: { data: UserSettingsResponseProperties } = await getUserSettings(apikey);

        // ToDo:
        console.log(data);

        return {
            error: false,
            data,
        };
    } catch (err) {
        if (err.response) {
            if (err.response.status === 401) {
                return {
                    error: true,
                    message: 'Error: Invalid API Key',
                };
            }

            return {
                error: true,
                message: 'Error: Something went wrong.',
            };
        }

        if (err.code === 'ECONNABORTED') {
            return {
                error: true,
                message: 'Error: Timed out',
            };
        }

        return {
            error: true,
            message: 'Error: Please check your internet connection',
        };
    }
}

/**
 *  Listen for messages from UI
 */
browser.runtime.onMessage.addListener((request, sender): void | Promise<any> => {
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
