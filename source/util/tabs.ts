import {browser, Tabs} from 'webextension-polyfill-ts';

export function openExtOptionsPage(): Promise<void> {
  return browser.runtime.openOptionsPage();
}

export function openHistoryPage(): Promise<Tabs.Tab> {
  return browser.tabs.create({
    active: true,
    url: 'history.html',
  });
}

export function getCurrentTab(): Promise<Tabs.Tab[]> {
  return browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
}
