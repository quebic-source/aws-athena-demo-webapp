import React from 'react';

export function getDefaultContext() {
  // default value
  return { 
    authUserInfo: null,
    appInfo: null
  }
}

export const AppContext = React.createContext({});
