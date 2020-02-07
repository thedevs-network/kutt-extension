import { browser, Storage } from 'webextension-polyfill-ts';

import { DomainEntryProperties } from '../Background';

// Core Extensions settings props
type ExtensionSettingsProperties = {
    apikey: string;
    autocopy: boolean;
    history: boolean;
    email?: string;
    domains?: DomainEntryProperties[];
};

export function openExtOptionsPage(): Promise<void> {
    return browser.runtime.openOptionsPage();
}

// update extension settings in browser storage
export function saveExtensionSettings(settings: Storage.StorageAreaSetItemsType): Promise<void> {
    return browser.storage.local.set({
        settings,
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getExtensionSettings(): Promise<{ [s: string]: any }> {
    return browser.storage.local.get('settings');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateExtensionSettings(newFields: { [s: string]: any }): Promise<void> {
    const { settings = {} } = await getExtensionSettings();

    return saveExtensionSettings({ ...settings, ...newFields });
}
