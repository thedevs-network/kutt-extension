/**
 *  kutt-extension
 *
 *  @author   abhijithvijayan <abhijithvijayan.in>
 *  @license  MIT License
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import browser, {Runtime} from 'webextension-polyfill';
import axios, {AxiosPromise, AxiosError} from 'axios';
import * as constants from './constants';

export enum Kutt {
  hostDomain = 'kutt.it',
  hostUrl = 'https://kutt.it',
}

export enum StoreLinks {
  chrome = 'https://chrome.google.com/webstore/detail/kutt/pklakpjfiegjacoppcodencchehlfnpd/reviews',
  firefox = 'https://addons.mozilla.org/en-US/firefox/addon/kutt/reviews/',
}

// **** ------------------ **** //

export type ErrorStateProperties = {
  error: boolean | null;
  message: string;
};

export type ApiErroredProperties = {
  error: true;
  message: string;
};

export type AuthRequestBodyProperties = {
  apikey: string;
  hostUrl: HostUrlProperties;
};

// **** ------------------ **** //

type HostUrlProperties = string;

export type DomainEntryProperties = {
  address: string;
  banned: boolean;
  created_at: string;
  id: string;
  homepage: string;
  updated_at: string;
};

type ShortenUrlBodyProperties = {
  target: string;
  password?: string;
  customurl?: string;
  reuse: boolean;
  domain?: string;
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

export interface ApiBodyProperties extends ShortenUrlBodyProperties {
  apikey: string;
}

export type ShortUrlActionBodyProperties = {
  apiBody: ApiBodyProperties;
  hostUrl: HostUrlProperties;
};

export type SuccessfulShortenStatusProperties = {
  error: false;
  data: ShortenLinkResponseProperties;
};

/**
 *  Shorten URL using v2 API
 */
async function shortenUrl({
  apiBody,
  hostUrl,
}: ShortUrlActionBodyProperties): Promise<
  SuccessfulShortenStatusProperties | ApiErroredProperties
> {
  try {
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
  } catch (error) {
    const err = error as AxiosError<{error?: string}>;
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
          message: `Error: ${err.response.data?.error}`,
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

// **** ------------------ **** //

export type UserSettingsResponseProperties = {
  apikey: string;
  email: string;
  domains: DomainEntryProperties[];
};

export type SuccessfulApiKeyCheckProperties = {
  error: false;
  data: UserSettingsResponseProperties;
};

function getUserSettings({
  apikey,
  hostUrl,
}: AuthRequestBodyProperties): AxiosPromise<any> {
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
}: AuthRequestBodyProperties): Promise<
  SuccessfulApiKeyCheckProperties | ApiErroredProperties
> {
  try {
    const {data}: {data: UserSettingsResponseProperties} =
      await getUserSettings({
        apikey,
        hostUrl,
      });

    return {
      error: false,
      data,
    };
  } catch (error) {
    const err = error as AxiosError;
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
      message: 'Error: Requesting to server failed.',
    };
  }
}

// **** ------------------ **** //

export type SuccessfulUrlsHistoryFetchProperties = {
  error: false;
  data: UserShortenedLinksHistoryResponseBody;
};

type UserShortenedLinksHistoryResponseBody = {
  limit: number;
  skip: number;
  total: number;
  data: UserShortenedLinkStats[];
};

export type UserShortenedLinkStats = {
  address: string;
  banned: boolean;
  created_at: string;
  id: string;
  link: string;
  password: boolean;
  target: string;
  updated_at: string;
  visit_count: number;
};

/**
 *  Fetch User's recent 15 shortened urls
 */

async function fetchUrlsHistory({
  apikey,
  hostUrl,
}: AuthRequestBodyProperties): Promise<
  SuccessfulUrlsHistoryFetchProperties | ApiErroredProperties
> {
  try {
    const {data}: {data: UserShortenedLinksHistoryResponseBody} = await axios({
      method: 'GET',
      timeout: constants.SHORTEN_URL_TIMEOUT,
      url: `${hostUrl}/api/v2/links`,
      params: {
        limit: constants.MAX_HISTORY_ITEMS,
      },
      headers: {
        'X-API-Key': apikey,
      },
    });

    return {
      error: false,
      data,
    };
  } catch (error) {
    const err = error as AxiosError;
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
      message: 'Error: Requesting to server failed.',
    };
  }
}

// **** ------------------ **** //

/**
 *  Service worker installation listener (MV3)
 */
browser.runtime.onInstalled.addListener((): void => {
  console.log('Kutt extension installed');
});

type MessageRequest = {
  action: string;
  params: any;
};

/**
 *  Listen for messages from UI pages
 */
browser.runtime.onMessage.addListener(
  (message: unknown, _sender: Runtime.MessageSender): void | Promise<any> => {
    const request = message as MessageRequest;
    // eslint-disable-next-line consistent-return
    // eslint-disable-next-line default-case
    switch (request.action) {
      case constants.CHECK_API_KEY: {
        return checkApiKey(request.params);
      }

      case constants.SHORTEN_URL: {
        return shortenUrl(request.params);
      }

      case constants.FETCH_URLS_HISTORY: {
        return fetchUrlsHistory(request.params);
      }
    }
  }
);
