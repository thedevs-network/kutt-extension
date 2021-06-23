export const removeProtocol = (link: string): string =>
  link.replace(/^https?:\/\//, '');

export function isValidUrl(url: string): boolean {
  // https://regex101.com/r/v2z8vZ/1
  const re = /^(http[s]?:\/\/)(www\.){0,1}[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}[.]{0,1}/;

  return re.test(url);
}
