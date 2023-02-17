import React, { Fragment, useMemo } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';

import { ChainInfo, ChainType, RelayChainName } from '../../utils/types';
import ChainIcon from './ChainIcon';
import { availableChains } from '../../utils/chains';
import { generateId } from '../../utils/helpers';

type Props = {
  relayChain: RelayChainName | undefined;
  chain: string;
  chainType: ChainType;
  onChange: (chain: ChainInfo) => void;
};

type ChainGroup = {
  title?: string;
  chains: Array<ChainInfo>;
  caption?: string;
  indented: boolean;
};

export default function ChainList({ relayChain, chain, chainType, onChange }: Props) {
  const chainGroups: Array<ChainGroup> = useMemo(() => {
    let relayChainInfo: ChainInfo | undefined,
      commonsChains: Array<ChainInfo> = [],
      paraChains: Array<ChainInfo> = [],
      independentChains: Array<ChainInfo> = [];

    switch (relayChain) {
      case RelayChainName.polkadot:
      case RelayChainName.kusama:
      case RelayChainName.westend:
      case RelayChainName.rococo: {
        relayChainInfo = availableChains.find((item) => item.info === relayChain);
        commonsChains = availableChains.filter((item) => item.relayChain === relayChain && item.isCommons);
        paraChains = availableChains.filter(
          (item) => item.relayChain === relayChain && item.isParachain && !item.isCommons,
        );
        break;
      }
      default: {
        independentChains = availableChains.filter(
          (item) =>
            !item.isRelayChain &&
            !item.isParachain &&
            ((chainType === ChainType.MAINNET && !item.isDevelopment) ||
              (chainType === ChainType.TESTNET && item.isDevelopment)),
        );
        break;
      }
    }

    let groups: Array<ChainGroup> = [];
    if (relayChainInfo) {
      groups.push({
        title: 'Relay Chain',
        chains: [relayChainInfo],
        indented: false,
      });
    }

    groups = groups.concat(
      [
        {
          title: 'Common Goods',
          chains: commonsChains,
          indented: true,
        },
        {
          title: 'Parachains',
          chains: paraChains,
          indented: true,
        },
        {
          chains: independentChains,
          indented: false,
        },
      ].filter((group) => group?.chains.length >= 1),
    );

    return groups;
  }, [relayChain, chainType]);
  const numGroups = chainGroups.length;

  return (
    <List dense={true}>
      {chainGroups.map((group, groupIdx) => {
        return (
          <Fragment key={`chain-group-${groupIdx}-${generateId([group?.title, group.chains.length.toString()])}`}>
            {group?.title ? <ListSubheader disableSticky={true}>{group?.title}</ListSubheader> : null}
            {group.chains.map((item, idx) => (
              <ListItem key={`chain-${groupIdx}-${idx}-${generateId([item?.info])}`} disablePadding>
                <ListItemButton selected={item?.info === chain} onClick={() => onChange(item)}>
                  <ListItemIcon sx={group.indented ? { ml: 1 } : {}}>
                    <ChainIcon name={item?.info ?? ''} size={25} text={item?.text} alt={item?.text} />
                  </ListItemIcon>
                  <ListItemText primary={item?.text} />
                </ListItemButton>
              </ListItem>
            ))}
            {groupIdx + 1 < numGroups ? <Divider /> : null}
          </Fragment>
        );
      })}
    </List>
  );
}
