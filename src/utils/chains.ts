import {
  prodChains,
  prodParasKusama,
  prodParasKusamaCommon,
  prodParasPolkadot,
  prodParasPolkadotCommon,
  prodRelayKusama,
  prodRelayPolkadot,
} from '@polkadot/apps-config/endpoints/production';
import {
  testChains,
  testParasRococo,
  testParasRococoCommon,
  testParasWestend,
  testParasWestendCommon,
  testRelayRococo,
  testRelayWestend,
} from '@polkadot/apps-config/endpoints/testing';
import { ethereumChains } from '@polkadot/apps-config/settings/ethereumChains';
import { allNetworks } from '@polkadot/networks';

import { ChainInfo, RelayChainName } from './types';

function addAttributesToChain(chain: Partial<ChainInfo>, attributes?: Partial<ChainInfo>): Partial<ChainInfo> {
  return {
    ...chain,
    ...attributes,
  };
}

function addAttributesToChains(
  chains: Array<Partial<ChainInfo>>,
  attributes?: Partial<ChainInfo>,
): Array<Partial<ChainInfo>> {
  return chains.map((endpoint) => addAttributesToChain(endpoint, attributes));
}

// Merges endpoint information from @polkadot/apps-config with network information from @polkadot/networks
function addNetworkInfoToChain(chain: Partial<ChainInfo>): ChainInfo {
  const network = allNetworks.find((item) => item.network === chain.info);
  let prefix = network?.prefix;
  if (typeof prefix !== 'number' && chain.isCommons && chain.relayChain) {
    // Common goods typically share the same prefix with the relay chain
    const relayChain = allNetworks.find((item) => item.network === (chain.relayChain as string));
    if (typeof relayChain?.prefix === 'number') {
      prefix = relayChain.prefix;
    }
  }

  return {
    ...chain,
    network: network?.network,
    displayName: network?.displayName,
    prefix,
    decimals: network?.decimals,
    standardAccount: network?.standardAccount,
    symbols: network?.symbols,
    website: network?.website ?? chain?.homepage,
    genesisHashes: network?.genesisHash,
    hasLedgerSupport: network?.hasLedgerSupport,
    iconTheme: network?.icon,
    isIgnored: network?.isIgnored,
    isTestnet: network?.isTestnet,
    slip44: network?.slip44,
    isEthereum: chain?.info && ethereumChains.includes(chain?.info ?? ''),
  } as ChainInfo;
}

function addNetworkInfoToChains(chains: Array<Partial<ChainInfo>>): Array<ChainInfo> {
  return chains.map((chain) => addNetworkInfoToChain(chain));
}

function isChainAvailable(chain: ChainInfo): boolean {
  return chain && !chain.isUnreachable && chain.providers && Object.keys(chain.providers).length >= 1;
}

export const allChains: Array<ChainInfo> = addNetworkInfoToChains([
  /* Mainnet */
  // Polkadot
  addAttributesToChain(prodRelayPolkadot, {
    isRelayChain: true,
    isDevelopment: false,
  }),
  ...addAttributesToChains(
    [
      ...addAttributesToChains(prodParasPolkadotCommon, {
        isCommons: true,
      }),
      ...prodParasPolkadot,
    ],
    {
      relayChain: RelayChainName.polkadot,
      isParachain: true,
      isDevelopment: false,
    },
  ),

  // Kusama
  addAttributesToChain(prodRelayKusama, {
    isRelayChain: true,
    isDevelopment: false,
  }),
  ...addAttributesToChains(
    [
      ...addAttributesToChains(prodParasKusamaCommon, {
        isCommons: true,
      }),
      ...prodParasKusama,
    ],
    {
      relayChain: RelayChainName.kusama,
      isParachain: true,
      isDevelopment: false,
    },
  ),

  // Independent
  ...addAttributesToChains(prodChains, {
    isRelayChain: false,
    isParachain: false,
    isDevelopment: false,
  }),

  /* Testnet */
  // Westend
  addAttributesToChain(testRelayWestend, {
    isRelayChain: true,
    isDevelopment: true,
  }),
  ...addAttributesToChains(
    [
      ...addAttributesToChains(testParasWestendCommon, {
        isCommons: true,
      }),
      ...testParasWestend,
    ],
    {
      relayChain: RelayChainName.westend,
      isParachain: true,
      isDevelopment: true,
    },
  ),

  // Rococo
  addAttributesToChain(testRelayRococo, {
    isRelayChain: true,
    isDevelopment: true,
  }),
  ...addAttributesToChains(
    [
      ...addAttributesToChains(testParasRococoCommon, {
        isCommons: true,
      }),
      ...testParasRococo,
    ],
    {
      relayChain: RelayChainName.rococo,
      isParachain: true,
      isDevelopment: true,
    },
  ),

  // Independent
  ...addAttributesToChains(testChains, {
    isRelayChain: false,
    isParachain: false,
    isDevelopment: true,
  }),
]);

export const defaultChain: ChainInfo = allChains.find((chain) => chain.info === RelayChainName.westend) ?? allChains[0];

export const availableChains: Array<ChainInfo> = allChains.filter((chain) => isChainAvailable(chain));
export const relayChainsMainnet: Array<RelayChainName> = [RelayChainName.polkadot, RelayChainName.kusama];
export const relayChainsTestnet: Array<RelayChainName> = [RelayChainName.westend, RelayChainName.rococo];
export const relayChains: Array<RelayChainName> = [
  // Mainnet
  ...relayChainsMainnet,
  // Testnet
  ...relayChainsTestnet,
];
