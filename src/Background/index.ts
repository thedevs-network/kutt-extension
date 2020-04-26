/**
 *  @author abhijithvijayan <abhijithvijayan.in>
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import {browser} from 'webextension-polyfill-ts';

import axios, {AxiosPromise} from 'axios';
import * as constants from './constants';

export enum Kutt {
  hostDomain = 'kutt.it',
  hostUrl = 'https://kutt.it',
}

type ShortenUrlBodyProperties = {
  target: string;
  password?: string;
  customurl?: string;
  reuse: boolean;
  domain?: string;
};

export interface ApiBodyProperties extends ShortenUrlBodyProperties {
  apikey: string;
}

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

type HostUrlProperties = string;

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

export type ShortUrlActionBodyProperties = {
  apiBody: ApiBodyProperties;
  hostUrl: HostUrlProperties;
};

export type GetUserSettingsBodyProperties = {
  apikey: string;
  hostUrl: HostUrlProperties;
};

async function shortenUrl({
  apiBody,
  hostUrl,
}: ShortUrlActionBodyProperties): Promise<
  SuccessfulShortenStatusProperties | ApiErroredProperties
> {
  try {
    // extract `apikey` from body
    const {apikey, ...otherParams} = apiBody;

    const {data}: {data: ShortenLinkResponseProperties} = await axios({
      method: 'POST',
      timeout: constants.SHORTEN_URL_TIMEOUT,
      url: `${hostUrl}/api/v2/links`,
      headers: {
        'X-API-Key': apikey,
      },
      data: {
        ...otherParams,
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

      // server request validation errors
      if (
        err.response.status === 400 &&
        Object.prototype.hasOwnProperty.call(err.response.data, 'error')
      ) {
        return {
          error: true,
          message: `Error: ${err.response.data.error}`,
        };
      }

      // ToDo: remove in the next major update
      if (err.response.status === 404) {
        return {
          error: true,
          message:
            'Error: This extension now uses API v2, please update your kutt.it instance.',
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

function getUserSettings({
  apikey,
  hostUrl,
}: GetUserSettingsBodyProperties): AxiosPromise<any> {
  return axios({
    method: 'GET',
    url: `${hostUrl}/api/v2/users`,
    timeout: constants.CHECK_API_KEY_TIMEOUT,
    headers: {
      'X-API-Key': apikey,
    },
  });
}

async function checkApiKey({
  apikey,
  hostUrl,
}: GetUserSettingsBodyProperties): Promise<
  SuccessfulApiKeyCheckProperties | ApiErroredProperties
> {
  try {
    const {
      data,
    }: {data: UserSettingsResponseProperties} = await getUserSettings({
      apikey,
      hostUrl,
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
browser.runtime.onMessage.addListener((request, _sender): void | Promise<
  any
> => {
  // eslint-disable-next-line default-case
  switch (request.action) {
    case constants.CHECK_API_KEY: {
      return checkApiKey(request.params);
    }

    case constants.SHORTEN_URL: {
      return shortenUrl(request.params);
    }
  }
});
