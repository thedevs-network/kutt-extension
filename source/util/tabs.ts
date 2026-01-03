import browser from 'webextension-polyfill';
import type {Tabs} from 'webextension-polyfill';

export function openExtOptionsPage(): Promise<void> {
  return browser.runtime.openOptionsPage();
}

export function openHistoryPage(): Promise<Tabs.Tab> {
  return browser.tabs.create({
    active: true,
    url: 'History/history.html',
  });
}

export function getCurrentTab(): Promise<Tabs.Tab[]> {
  return browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
}
