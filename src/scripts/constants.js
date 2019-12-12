/* eslint-disable camelcase */

export const KUTT_IT_DEFAULT_DOMAIN = 'https://kutt.it';
export const FIREFOX = 'firefox';
export const OPERA = 'opera';
export const CHROME = 'chrome';

// popup page
export const QRCODE_IMAGE_NODE = '#qr_code';
export const URL_HOLDER = '#url__content-inner';
export const BUTTONS_GROUP = '.buttons__content--holder';
export const COPY_BUTTON = '#button__copy--holder';
export const COPIED_ALERT_HOLDER = '#copy__alert';
export const QRCODE_HOLDER = '.qrcode__content--holder';
export const QRCODE_BUTTON = '#button__qrcode--holder';
export const QR_EXTERNAL_API_URL = 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=';

// options page
export const PASSWORD_HOLDER = '#pwd__holder';
export const CUSTOM_HOST_URL_HOLDER = '#customhost__holder';
export const SAVE_BUTTON = '#button__submit';
export const PASSWORD_INPUT = '#password--value';
export const CUSTOM_HOST_URL_INPUT = '#customhost__mode--value';
export const API_KEY_INPUT = '#api__key--value';
export const PASSWORD_VIEW_TOGGLER = '#view__password--eye';
export const PASSWORD_INPUT_TOGGLE_SWITCH = '#password__label--switch';
export const CUSTOM_HOST_INPUT_TOGGLE_SWITCH = '#customhost__label--switch';
export const PASSWORD_OPTION_CHECKBOX = '#password__label--checkbox';
export const CUSTOM_HOST_OPTION_CHECKBOX = '#customhost__label--checkbox';
export const SAVE_HISTORY_OPTION_CHECKBOX = '#history__label--checkbox';
export const AUTOCOPY_OPTION_CHECKBOX = '#autocopy__label--checkbox';

// history page
export const CLEAR_HISTORY_BUTTON = '#table__clearAll--btn';
export const ALERT_COPIED_HOLDER = '#flash_copy';
export const HISTORY_VIEW_TABLE = '.table__content--holder';
export const RATE_NOW_BUTTON = '#rate__button';
export const DASHBOARD_BUTTON = '#home__button';
export const HISTORY_VIEW_TABLE_PARENT_NODE = '#delegation__element';
export const CHROME_STORE_LINK =
    'https://chrome.google.com/webstore/detail/kutt/pklakpjfiegjacoppcodencchehlfnpd/reviews';
export const FIREFOX_STORE_LINK = 'https://addons.mozilla.org/en-US/firefox/addon/kutt/reviews/';

export const COPY_BUTTON_ID = 'copy';
export const QRCODE_BUTTON_ID = 'qrcode';
export const QRCODE_POPUP_CLOSE_BUTTON_ID = 'close__btn';

export const NO_URLS_TO_SHOW = '<h2 class="py-2 table-inner">No Shortened URLs</h2>';
export const COPIED_TO_CLIPBOARD = '<div class="table_body--flashCopy" id="flash_copy">Copied to clipboard!</div>';
export const FAILED_TO_COPY = '<div class="table_body--flashCopy" id="flash_copy">Error while Copying!!</div>';

export const QRCODE_POPUP_NODE = '#qrcode__template';
export const QRCODE_POPUP_NODE_TEMPLATE = `
    <div class="table__qrcodePopup--div" id="qrcode__template">
        <div class="table__qrcode--popup">
            <div class="table__qrcode--holder">
                <img id="table__qrcode" src="%qrcodeLink%" alt="QRCode" />
            </div>
            <div class="table__closebtn--holder">
                <button type="button" class="table__closebtn--inner" id="close__btn-%num%">Close</button>
            </div>
        </div>
    </div>
`;

export const HISTORY_TABLE_ITEM_HTML = `
    <tr class="table__body--holder" id="table__body-%num%">
        <td class="table__body--original">
            <a href="%longLink%" class="table__body--originalURL" target="_blank" rel="noopener noreferrer nofollow">%longLink%</a>
        </td>
        <td class="table__body--shortened" id="table__shortened-%num%">
            <div class="table__body--shortenBody">
                <a href="%shortLink%" id="shortUrl-%num%" class="table__body--shortenURL" target="_blank" rel="noopener noreferrer nofollow">%shortLink%</a>
            </div>
        </td>
        <td class="table__body--functionBtns">
            <div class="table__body--btnHolder" id="btns-%num%">
                <button type="button" class="table__body--copy" id="copy-%num%" title="Copy">
                    <img class="selectDisable icon__img" src="assets/copy.svg" alt="copy" />
                </button>
                <button type="button" class="table__body--qrcode" id="qrcode-%num%" title="QR Code">
                    <img class="selectDisable icon__img" src="assets/qrcode.svg" alt="QR Code" />
                </button>
            </div>
        </td>
    </tr>
`;
