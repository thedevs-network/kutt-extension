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

export function isValidUrl(url: string): boolean {
  // https://regex101.com/r/iXVlNL/1/
  const re = /^(http[s]?:\/\/)(www\.){0,1}[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}[.]{0,1}/;

  return re.test(url);
}
