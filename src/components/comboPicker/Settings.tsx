import React, { ChangeEvent, useMemo, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import { SxProps } from '@mui/material';

import ChainIcon from '../chainPicker/ChainIcon';
import { Account, ChainInfo } from '../../utils/types';
import { generateId } from '../../utils/helpers';

type Props = {
  account?: Account;
  chain: ChainInfo;
  onChangeAccount: (account: Account) => void;
  onChangeChain: (chain: ChainInfo) => void;
  onClose: () => void;
  sx?: SxProps;
};

const StyledSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledSectionTitle = styled(Typography)(({ theme }) => ({
  display: 'block',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export default function Settings({ chain, onChangeChain, onClose, sx }: Props) {
  const [providerName, setProviderName] = useState(chain?.provider?.name ?? '');

  const handleProviderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setProviderName(name);

    // Set provider for current chain
    onChangeChain({
      ...chain,
      provider: {
        name: name ?? '',
        url: chain?.providers[name] ?? '',
      },
    });

    onClose();
  };

  const providerNames: Array<string> = useMemo(() => {
    return Object.keys(chain.providers).sort();
  }, [chain]);

  return (
    <Box sx={{ p: 2, ...sx }}>
      <StyledSection>
        <StyledSectionTitle>Chain:</StyledSectionTitle>
        <Stack direction="row" sx={{ mb: 2 }}>
          <ChainIcon name={chain?.info ?? ''} size={25} text={chain?.text} alt={chain?.text} sx={{ mr: 1 }} />{' '}
          {chain?.text}
        </Stack>
      </StyledSection>

      <FormControl>
        <FormLabel id="provider-list">Node Service Provider:</FormLabel>
        <RadioGroup
          aria-labelledby="provider-list"
          name="provider-list"
          value={providerName}
          onChange={handleProviderChange}
        >
          {providerNames.map((name, idx) => (
            <FormControlLabel
              key={`node-provider-${idx}-${generateId([name])}`}
              value={name}
              control={<Radio size="small" />}
              label={/^light\sclient/i.test(name) ? `${name} (experimental)` : name}
            />
          ))}
        </RadioGroup>
      </FormControl>

      {/* TODO: Add option to always use a specific provider for a chain */}
    </Box>
  );
}
