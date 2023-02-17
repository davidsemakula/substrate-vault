import { EndpointOption } from '@polkadot/apps-config/endpoints/types';
import type { InjectedExtension } from '@polkadot/extension-inject/types';
import { Prefix } from '@polkadot/util-crypto/types';
import type { Icon as IconTheme } from '@polkadot/networks/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { BlockNumber } from '@polkadot/types/interfaces';

export enum TransactionType {
  any = 'Any',
  non_transfer = 'Non-transfer',
  governance = 'Governance',
  staking = 'Staking',
  identity_judgement = 'Identity Judgement',
  auction = 'Auction',
  cancel = 'Cancel',
}

export type Signatory = {
  address: string;
  name?: string;
};

export type Policy = {
  name?: string;
  type: TransactionType;
  signatories: Array<Signatory>;
  threshold: number;
};

export type VaultMeta = {
  blockNumber?: string;
  blockHash?: string;
};

export type Vault = {
  name?: string;
  chain: string;
  address?: string;
  policies: Array<Policy>;
  meta?: VaultMeta;
};

export enum AccountType {
  standard = 'standard',
  multisig = 'multisig',
  pure_proxy = 'pure-proxy',
}

export enum ProxyActionType {
  add = 'add',
  remove = 'remove',
}

export type ProxyAction = {
  action: ProxyActionType;
  proxyType: TransactionType;
  account: string;
  accountType?: AccountType;
};

export enum ColorMode {
  light = 'light',
  dark = 'dark',
}

export type Account = {
  id: string;
  address: string;
  name: string;
  genesisHash: string;
  source: string;
  type: string;
};

export enum ChainType {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

export enum RelayChainName {
  // Mainnet
  polkadot = 'polkadot',
  kusama = 'kusama',

  // Testnet
  westend = 'westend',
  rococo = 'rococo',
}

// Merges endpoint information from @polkadot/apps-config with network information from @polkadot/networks
export interface ChainInfo extends EndpointOption {
  // Ecosystem
  isRelayChain?: boolean;
  relayChain?: RelayChainName;
  isCommons?: boolean;
  isParachain?: boolean;

  // Network
  // See Network type in https://github.com/polkadot-js/common/blob/master/packages/networks/src/types.ts
  // We can't simply extend these interfaces though cause these fields are optional for us
  network?: string;
  displayName?: string;
  prefix?: Prefix;
  decimals?: Array<number>;
  standardAccount?: '*25519' | 'Ed25519' | 'Sr25519' | 'secp256k1' | null;
  symbols?: Array<string>;
  website?: string | null;
  genesisHashes?: Array<string>;
  hasLedgerSupport?: boolean;
  iconTheme?: IconTheme;
  isIgnored?: boolean;
  isTestnet?: boolean;
  slip44?: number | null;
  isEthereum?: boolean;

  // State
  provider?: ProviderInfo;
  isValidated?: boolean;
}

export type Wallet = InjectedExtension;

export type ProviderInfo = {
  name: string;
  url: string;
};

export interface ISubmittableResultWithBlockNumber extends ISubmittableResult {
  // blockNumber is missing from ISubmittableResult
  blockNumber?: BlockNumber;
}
