import React from 'react';
import { defaultChain } from '../utils/chains';
import {
  ApiContextType,
  AppContextActionsType,
  AppContextTypes,
  UserContextActionsType,
  UserContextType,
  WalletContextType,
} from './types';

const AppContext = React.createContext<
  AppContextTypes &
    UserContextType &
    WalletContextType &
    ApiContextType &
    AppContextActionsType &
    UserContextActionsType
>({
  // Data
  loading: false,
  drawerOpen: false,
  chain: defaultChain,
  account: null,
  signer: null,
  accounts: [],
  wallets: [],
  api: null,
  apiSupported: undefined,

  // Actions
  /* eslint-disable @typescript-eslint/no-empty-function */
  setLoading: () => {},
  toggleColorMode: () => {},
  toggleDrawer: () => {},
  setChain: () => {},
  setAccount: () => {},
  setVault: () => {},
  /* eslint-enable @typescript-eslint/no-empty-function */
});

export default AppContext;
