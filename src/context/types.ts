import { Signer } from '@polkadot/api/types';
import { ApiPromise } from '@polkadot/api';

import { Account, ChainInfo, Vault, Wallet } from '../utils/types';

// Data and Status
export type AppContextTypes = {
  loading: boolean;
  drawerOpen: boolean;
};

export type UserContextType = {
  chain: ChainInfo;
  account?: Account | null;
  vault?: Vault | null;
  accounts: Array<Account>;
};

export type WalletContextType = {
  signer?: Signer | null;
  wallets: Array<Wallet>;
};

export type ApiContextType = {
  api?: ApiPromise | null;
  apiSupported?: boolean;
};

// Actions
export type AppContextActionsType = {
  setLoading: (loading: boolean) => void;
  toggleColorMode: () => void;
  toggleDrawer: () => void;
};

export type UserContextActionsType = {
  setChain: (chain: ChainInfo) => void;
  setAccount: (account: Account) => void;
  setVault: (vault?: Vault | null) => void;
};
