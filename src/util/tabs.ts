import { browser, Tabs } from 'webextension-polyfill-ts';

export function openExtOptionsPage(): Promise<void> {
    return browser.runtime.openOptionsPage();
}

export function getCurrentTab(): Promise<Tabs.Tab[]> {
    return browser.tabs.query({
        active: true,
        lastFocusedWindow: true,
    });
}
