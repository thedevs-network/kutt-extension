import {EMPTY_STRING} from '@abhijithvijayan/ts-utils';

// Custom fork of https://github.com/DamonOehlman/detect-browser/blob/master/src/index.ts
type Browser = 'edge-chromium' | 'chrome' | 'firefox' | 'opera';
type UserAgentRule = [Browser, RegExp];
type UserAgentMatch = [Browser, RegExpExecArray] | false;

const userAgentRules: UserAgentRule[] = [
  ['edge-chromium', /Edg\/([0-9.]+)/],
  ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9.]+)(:?\s|$)/],
  ['firefox', /Firefox\/([0-9.]+)(?:\s|$)/],
  ['opera', /Opera\/([0-9.]+)(?:\s|$)/],
  ['opera', /OPR\/([0-9.]+)(:?\s|$)/],
];

function matchUserAgent(ua: string): UserAgentMatch {
  return (
    ua !== EMPTY_STRING &&
    userAgentRules.reduce<UserAgentMatch>(
      (matched: UserAgentMatch, [browser, regex]) => {
        if (matched) {
          return matched;
        }

        const uaMatch = regex.exec(ua);
        return !!uaMatch && [browser, uaMatch];
      },
      false
    )
  );
}
export function detectBrowser(): Browser | null {
  const matchedRule = matchUserAgent(navigator.userAgent);

  if (!matchedRule) {
    return null;
  }

  const [name, match] = matchedRule;

  let versionParts = match[1] && match[1].split(/[._]/).slice(0, 3);
  if (!versionParts) {
    versionParts = [];
  }

  return name;
}
