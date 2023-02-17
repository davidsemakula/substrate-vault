import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import BoltIcon from '@mui/icons-material/Bolt';
import BugReportIcon from '@mui/icons-material/BugReport';

import ChainIcon from './ChainIcon';
import ChainList from './ChainList';
import { ChainInfo, ChainType, RelayChainName } from '../../utils/types';
import { generateId, getDisplayName } from '../../utils/helpers';
import { relayChains, relayChainsMainnet, relayChainsTestnet } from '../../utils/chains';

type Props = {
  chain: ChainInfo;
  onChange: (chain: ChainInfo) => void;
  onClose: () => void;
};

export default function ChainSwitcher({ chain, onChange, onClose }: Props) {
  const currentRelayChain: RelayChainName = (
    relayChains.includes(chain?.info as RelayChainName) ? chain?.info : chain?.relayChain
  ) as RelayChainName;
  const [relayChain, setRelayChain] = useState<RelayChainName | undefined>(currentRelayChain);
  const [chainType, setChainType] = useState<ChainType>(ChainType.MAINNET);

  useEffect(() => {
    if (relayChain) {
      if (relayChainsMainnet.includes(relayChain) && chainType !== ChainType.MAINNET) {
        setChainType(ChainType.MAINNET);
      } else if (relayChainsTestnet.includes(relayChain) && chainType !== ChainType.TESTNET) {
        setChainType(ChainType.TESTNET);
      }
    }
  }, [relayChain, chainType]);

  const handleRelayChainChange = (event: SelectChangeEvent<unknown>) => {
    const value = event.target.value as string;
    const newRelayChain = (value && relayChains.includes(value as RelayChainName) ? value : undefined) as
      | RelayChainName
      | undefined;
    setRelayChain(newRelayChain);
    if (!newRelayChain && chainType === ChainType.TESTNET) {
      // Default to mainnet for unknown or undefined relay chain
      setChainType(ChainType.MAINNET);
    }
  };

  const handleChainTypeChange = (event: SelectChangeEvent<unknown>) => {
    setChainType(event.target.value as ChainType);
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" sx={{ p: 2, pb: 1 }}>
        {/* TODO: Add search option */}
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel id="relay-chain-select">Ecosystem</InputLabel>
          <Select
            labelId="relay-chain-select"
            id="relay-chain-select"
            value={relayChain ?? 'none'}
            label="Ecosystem"
            onChange={handleRelayChainChange}
          >
            {[
              ...relayChains,
              // Independent
              'none', // 'none' is only ever seen inside this component, it's converted to undefined elsewhere
            ].map((chain) => {
              const internalValue = relayChains.includes(chain as RelayChainName) ? chain : 'none',
                displayName = getDisplayName(internalValue);
              return (
                <MenuItem key={`relay-chain-${generateId([internalValue])}`} value={internalValue}>
                  <Stack direction="row" alignItems="center">
                    <ChainIcon
                      name={chain ?? ''}
                      size={18}
                      text={displayName}
                      alt={displayName}
                      sx={{ mr: 1, visibility: relayChains.includes(chain as RelayChainName) ? 'visible' : 'hidden' }}
                    />{' '}
                    {displayName}
                  </Stack>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel id="account-select">Environment</InputLabel>
          <Select
            labelId="chain-type-select"
            id="chain-type-select"
            value={chainType ?? ''}
            label="Environment"
            disabled={relayChain && relayChains.includes(relayChain)}
            onChange={handleChainTypeChange}
          >
            {[ChainType.MAINNET, ChainType.TESTNET].map((type) => (
              <MenuItem key={`relay-chain-${generateId([type])}`} value={type}>
                <Stack direction="row" alignItems="center">
                  {type === ChainType.MAINNET ? <BoltIcon sx={{ mr: 0.5 }} /> : <BugReportIcon sx={{ mr: 0.5 }} />}{' '}
                  {type}
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Box sx={{ maxHeight: '50vh', overflowY: 'auto' }}>
        <ChainList
          relayChain={relayChain}
          chain={chain?.info ?? ''}
          chainType={chainType}
          onChange={(chain) => {
            onChange(chain);
            onClose();
          }}
        />
      </Box>
    </>
  );
}
