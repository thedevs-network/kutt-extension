import type {JSX} from 'react';
import {createContext, useContext, useReducer, type ReactNode} from 'react';

import {UserShortenedLinkStats} from '../Background';

export enum ShortenedLinksActionTypes {
  HYDRATE_SHORTENED_LINKS = 'hydrate-shortened-links',
  SET_CURRENT_SELECTED = 'toggle-qrcode-modal',
}

type HYDRATE_SHORTENED_LINKS = {
  type: ShortenedLinksActionTypes.HYDRATE_SHORTENED_LINKS;
  payload: {
    items: UserShortenedLinkStats[];
    total: number;
  };
};

type SET_CURRENT_SELECTED = {
  type: ShortenedLinksActionTypes.SET_CURRENT_SELECTED;
  payload: string;
};

type Action = HYDRATE_SHORTENED_LINKS | SET_CURRENT_SELECTED;

type InitialValues = {
  items: UserShortenedLinkStats[];
  total: number;
  selected: UserShortenedLinkStats | null;
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

    case ShortenedLinksActionTypes.SET_CURRENT_SELECTED: {
      const selected: null | UserShortenedLinkStats =
        state.items.filter((item) => item.id === action.payload)[0] || null;

      return {...state, selected};
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

type ShortenedLinksProviderProps = {
  children: ReactNode;
};

function ShortenedLinksProvider({
  children,
}: ShortenedLinksProviderProps): JSX.Element {
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
}

export {useShortenedLinks, ShortenedLinksProvider};
