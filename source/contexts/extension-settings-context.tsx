/* eslint-disable @typescript-eslint/naming-convention */
import {createContext, useReducer, useContext, type ReactNode} from 'react';

import {Kutt} from '../Background';

export enum ExtensionSettingsActionTypes {
  HYDRATE_EXTENSION_SETTINGS = 'set-extension-settings',
  RELOAD_EXTENSION_SETTINGS = 'reload-extension-settings',
}

export type HostProperties = {
  hostDomain: string;
  hostUrl: string;
};

export type DomainOptionsProperties = {
  option: string;
  value: string;
  id: string;
  disabled?: boolean;
};

type HYDRATE_EXTENSION_SETTINGS = {
  type: ExtensionSettingsActionTypes.HYDRATE_EXTENSION_SETTINGS;
  payload:
    | {
        apikey: string;
        domainOptions: DomainOptionsProperties[];
        host: HostProperties;
      }
    | {
        apikey: string;
        host: HostProperties;
        history: boolean;
        advanced: boolean;
      };
};

type RELOAD_EXTENSION_SETTINGS = {
  type: ExtensionSettingsActionTypes.RELOAD_EXTENSION_SETTINGS;
  payload: boolean;
};

type Action = HYDRATE_EXTENSION_SETTINGS | RELOAD_EXTENSION_SETTINGS;

type InitialValues = {
  apikey: string;
  domainOptions: DomainOptionsProperties[];
  host: HostProperties;
  reload: boolean;
  history: boolean;
  advanced: boolean;
};

const initialValues: InitialValues = {
  apikey: '',
  domainOptions: [],
  host: Kutt,
  reload: false,
  history: false,
  advanced: false,
};

type State = InitialValues;
type Dispatch = (action: Action) => void;

const ExtensionSettingsStateContext = createContext<State | undefined>(
  undefined
);
const ExtensionSettingsDispatchContext = createContext<Dispatch | undefined>(
  undefined
);

function extensionSettingsReducer(state: State, action: Action): State {
  switch (action.type) {
    case ExtensionSettingsActionTypes.HYDRATE_EXTENSION_SETTINGS: {
      return {...state, ...action.payload};
    }

    case ExtensionSettingsActionTypes.RELOAD_EXTENSION_SETTINGS: {
      return {...state, reload: action.payload};
    }

    default:
      return state;
  }
}

function useExtensionSettingsState(): State {
  const context = useContext(ExtensionSettingsStateContext);

  if (context === undefined) {
    throw new Error(
      'useExtensionSettingsState must be used within a ExtensionSettingsProvider'
    );
  }

  return context;
}

function useExtensionSettingsDispatch(): Dispatch {
  const context = useContext(ExtensionSettingsDispatchContext);

  if (context === undefined) {
    throw new Error(
      'useExtensionSettingsDispatch must be used within a ExtensionSettingsProvider'
    );
  }

  return context;
}

function useExtensionSettings(): [State, Dispatch] {
  // To access const [state, dispatch] = useExtensionSettings()
  return [useExtensionSettingsState(), useExtensionSettingsDispatch()];
}

type ExtensionSettingsProviderProps = {
  children: ReactNode;
};

function ExtensionSettingsProvider({
  children,
}: ExtensionSettingsProviderProps) {
  const [state, dispatch] = useReducer(extensionSettingsReducer, initialValues);

  return (
    <>
      <ExtensionSettingsStateContext.Provider value={state}>
        <ExtensionSettingsDispatchContext.Provider value={dispatch}>
          {children}
        </ExtensionSettingsDispatchContext.Provider>
      </ExtensionSettingsStateContext.Provider>
    </>
  );
};

export {ExtensionSettingsProvider, useExtensionSettings};
