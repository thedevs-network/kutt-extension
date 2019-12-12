/* eslint-disable camelcase */

// popup page
export const qrcode__holder = '#qr_code';
export const url__holder = '#url__content-inner';
export const buttons = '.buttons__content--holder';
export const copy__btn = '#button__copy--holder';
export const copyalert__holder = '#copy__alert';
export const qrcode__content = '.qrcode__content--holder';
export const qrcode__btn = '#button__qrcode--holder';
export const qrcode__api = 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=';

// options page
export const pwd__holder = '#pwd__holder';
export const dev__holder = '#customhost__holder';
export const submit__btn = '#button__submit';
export const pwd__value = '#password--value';
export const dev__value = '#customhost__mode--value';
export const api__holder = '#api__key--value';
export const pwd__eye = '#view__password--eye';
export const pwd__switch = '#password__label--switch';
export const dev__switch = '#customhost__label--switch';
export const pwd__checkbox = '#password__label--checkbox';
export const dev__checkbox = '#customhost__label--checkbox';
export const history__checkbox = '#history__label--checkbox';
export const autocopy__checkbox = '#autocopy__label--checkbox';

// history page
export const clear__btn = '#table__clearAll--btn';
export const table = '.table__content--holder';
export const rate__button = '#rate__button';
export const home__button = '#home__button';
export const main__element = '#delegation__element';
export const chromeStoreLink =
    'https://chrome.google.com/webstore/detail/kutt/pklakpjfiegjacoppcodencchehlfnpd/reviews';
export const firefoxStoreLink = 'https://addons.mozilla.org/en-US/firefox/addon/kutt/reviews/';
export const html = `
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
