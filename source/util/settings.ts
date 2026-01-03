import browser from 'webextension-polyfill';

import {DomainEntryProperties} from '../Background';

// Core Extensions settings props
export type ExtensionSettingsProperties = {
  apikey: string;
  history: boolean;
  user?: {
    email?: string;
    domains?: DomainEntryProperties[];
  } | null;
};

// update extension settings in browser storage
export function saveExtensionSettings(settings: any): Promise<void> {
  return browser.storage.local.set({
    settings,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getExtensionSettings(): Promise<{[s: string]: any}> {
  return browser.storage.local.get('settings');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateExtensionSettings(newFields?: {
  [s: string]: any;
}): Promise<void> {
  const {settings = {}} = await getExtensionSettings();

  return saveExtensionSettings({...settings, ...newFields});
}

// Clear all extension settings
export function clearExtensionSettings(): Promise<void> {
  return browser.storage.local.clear();
}
