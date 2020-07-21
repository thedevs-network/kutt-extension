/* eslint-disable @typescript-eslint/naming-convention */
import React, {createContext, useContext, useReducer} from 'react';

import {UserShortenedLinkStats} from '../Background';

export enum ShortenedLinksActionTypes {
  HYDRATE_SHORTENED_LINKS = 'hydrate-shortened-links',
}

type HYDRATE_SHORTENED_LINKS = {
  type: ShortenedLinksActionTypes.HYDRATE_SHORTENED_LINKS;
  payload: {
    items: UserShortenedLinkStats[];
    total: number;
  };
};

type Action = HYDRATE_SHORTENED_LINKS;

type InitialValues = {
  items: UserShortenedLinkStats[];
  total: number;
  selected: string | null;
};

const initialValues: InitialValues = {
  items: [],
  total: 0,
  selected: null,
};

type State = InitialValues;
type Dispatch = (action: Action) => void;

const ShortenedLinksStateContext = createContext<State | undefined>(undefined);
const ShortenedLinksDispatchContext = createContext<Dispatch | undefined>(
  undefined
);

const shortenedLinksReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ShortenedLinksActionTypes.HYDRATE_SHORTENED_LINKS: {
      return {
        ...state,
        ...action.payload,
      };
    }

    default:
      return state;
  }
};

function useShortenedLinksContextState(): State {
  const context = useContext(ShortenedLinksStateContext);

  if (context === undefined) {
    throw new Error(
      'useShortenedLinksContextState must be used within a ShortenedLinksProvider'
    );
  }

  return context;
}

function useShortenedLinksContextDispatch(): Dispatch {
  const context = useContext(ShortenedLinksDispatchContext);

  if (context === undefined) {
    throw new Error(
      'useShortenedLinksContextDispatch must be used within a ShortenedLinksProvider'
    );
  }

  return context;
}

function useShortenedLinks(): [State, Dispatch] {
  return [useShortenedLinksContextState(), useShortenedLinksContextDispatch()];
}

const ShortenedLinksProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer(shortenedLinksReducer, initialValues);

  return (
    <>
      <ShortenedLinksStateContext.Provider value={state}>
        <ShortenedLinksDispatchContext.Provider value={dispatch}>
          {children}
        </ShortenedLinksDispatchContext.Provider>
      </ShortenedLinksStateContext.Provider>
    </>
  );
};

export {useShortenedLinks, ShortenedLinksProvider};
