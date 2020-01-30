import { browser } from 'webextension-polyfill-ts';

export function openExtOptionsPage(): Promise<void> {
    return browser.runtime.openOptionsPage();
}
