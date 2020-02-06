import { browser, Storage } from 'webextension-polyfill-ts';

// update extension settings in browser storage
export function updateSettings(settings: Storage.StorageAreaSetItemsType): Promise<void> {
    return browser.storage.local.set({
        settings,
    });
}
