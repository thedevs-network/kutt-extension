import React, {useEffect, useState} from 'react';

import {getExtensionSettings} from '../util/settings';
import BodyWrapper from '../components/BodyWrapper';
import {isValidUrl} from '../util/tabs';
import Loader from '../components/Loader';
import OptionsForm from './OptionsForm';

export type ExtensionConfigProperties = {
  apikey: string;
  history: boolean;
  advanced: boolean;
  customhost: string; // for form values
};

const Options: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [extensionConfig, setExtensionConfig] = useState<
    ExtensionConfigProperties
  >({
    apikey: '',
    history: false,
    advanced: false,
    customhost: '',
  });

  useEffect(() => {
    async function getSavedSettings(): Promise<void> {
      const {settings = {}} = await getExtensionSettings();
      // eslint-disable-next-line no-nested-ternary
      const customHost: string = settings.customhost
        ? isValidUrl(settings.customhost)
          ? settings.customhost
          : extensionConfig.customhost
        : extensionConfig.customhost;
      const advancedSettings: boolean =
        settings.advanced || extensionConfig.advanced;

      // inject existing keys (if field doesn't exist, use default)
      const defaultExtensionConfig: ExtensionConfigProperties = {
        apikey: settings.apikey || extensionConfig.apikey,
        history: Object.prototype.hasOwnProperty.call(settings, 'history')
          ? settings.history
          : extensionConfig.history,
        advanced:
          customHost.trim().length > 0
            ? advancedSettings
            : extensionConfig.advanced, // disable `advance` if customhost is not set
        customhost:
          // eslint-disable-next-line no-nested-ternary
          advancedSettings === true
            ? customHost.endsWith('/')
              ? customHost.slice(0, -1)
              : customHost.toLowerCase()
            : extensionConfig.customhost, // drop customhost value if `advanced` is false
      };

      setExtensionConfig(defaultExtensionConfig);
      setLoading(false);
    }

    getSavedSettings();
  }, [
    extensionConfig.apikey,
    extensionConfig.history,
    extensionConfig.advanced,
    extensionConfig.customhost,
  ]); // dependencies

  return (
    <BodyWrapper>
      <div id="options">
        {!loading ? (
          <OptionsForm extensionConfig={extensionConfig} />
        ) : (
          <Loader />
        )}
      </div>
    </BodyWrapper>
  );
};

export default Options;
