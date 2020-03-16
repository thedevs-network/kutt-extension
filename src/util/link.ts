export const removeProtocol = (link: string): string => {
    return link.replace(/^https?:\/\//, '');
};
