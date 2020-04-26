export const removeProtocol = (link: string): string =>
  link.replace(/^https?:\/\//, '');
