declare const __DEV__: boolean;
declare const __TARGET_BROWSER__: 'chrome' | 'firefox' | 'opera';

declare module '*.module.scss' {
  const classes: {readonly [key: string]: string};
  export default classes;
}

declare module '*.scss' {
  const content: string;
  export default content;
}
