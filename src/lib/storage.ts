import { browser, Storage } from 'webextension-polyfill-ts';

// update extension settings in chrome storage
export function updateSettings(settings: Storage.StorageAreaSetItemsType): Promise<void> {
    return browser.storage.local.set({
        settings,
    });
}
