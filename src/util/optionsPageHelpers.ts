import { browser, Storage } from 'webextension-polyfill-ts';

export function openExtOptionsPage(): Promise<void> {
    return browser.runtime.openOptionsPage();
}

// update extension settings in browser storage
export function updateExtensionSettings(settings: Storage.StorageAreaSetItemsType): Promise<void> {
    return browser.storage.local.set({
        settings,
    });
}
