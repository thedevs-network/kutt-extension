/* eslint-disable @typescript-eslint/naming-convention */
import React, {createContext, useReducer, useContext} from 'react';

export enum RequestStatusActionTypes {
  SET_REQUEST_STATUS = 'set-request-status',
  SET_LOADING = 'set-loading',
}

type SET_REQUEST_STATUS = {
  type: RequestStatusActionTypes.SET_REQUEST_STATUS;
  payload: {
    error: boolean;
    message: string;
  };
};

type SET_LOADING = {
  type: RequestStatusActionTypes.SET_LOADING;
  payload: boolean;
};

type Action = SET_REQUEST_STATUS | SET_LOADING;

type InitialValues = {
  loading: boolean;
  error: boolean | null;
  message: string;
};

const initialValues: InitialValues = {
  loading: true,
  error: null,
  message: '',
};

type State = InitialValues;
type Dispatch = (action: Action) => void;

const RequestStatusStateContext = createContext<State | undefined>(undefined);
const RequestStatusDispatchContext = createContext<Dispatch | undefined>(
  undefined
);

function requestStatusReducer(state: State, action: Action): State {
  switch (action.type) {
    case RequestStatusActionTypes.SET_REQUEST_STATUS: {
      return {...state, ...action.payload};
    }

    case RequestStatusActionTypes.SET_LOADING: {
      return {...state, loading: action.payload};
    }

    default:
      return state;
  }
}

function useRequestStatusState(): State {
  const context = useContext(RequestStatusStateContext);

  if (context === undefined) {
    throw new Error(
      'useRequestStatusState must be used within a RequestStatusProvider'
    );
  }

  return context;
}

function useRequestStatusDispatch(): Dispatch {
  const context = useContext(RequestStatusDispatchContext);

  if (context === undefined) {
    throw new Error(
      'useRequestStatusDispatch must be used within a RequestStatusProvider'
    );
  }

  return context;
}

function useRequestStatus(): [State, Dispatch] {
  // To access const [state, dispatch] = useRequestStatus()
  return [useRequestStatusState(), useRequestStatusDispatch()];
}

type RequestStatusProviderProps = {
  children: React.ReactNode;
};

const RequestStatusProvider: React.FC<RequestStatusProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(requestStatusReducer, initialValues);

  return (
    <>
      <RequestStatusStateContext.Provider value={state}>
        <RequestStatusDispatchContext.Provider value={dispatch}>
          {children}
        </RequestStatusDispatchContext.Provider>
      </RequestStatusStateContext.Provider>
    </>
  );
};

export {RequestStatusProvider, useRequestStatus};
