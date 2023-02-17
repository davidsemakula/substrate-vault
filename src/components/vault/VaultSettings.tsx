import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import Summary from './core/Summary';
import useVault from '../../hooks/useVault';
import useAccounts from '../../hooks/useAccounts';
import { getChainAccount, getChainByName } from '../../utils/helpers';
import Title from '../core/Title';
import Copy from '../core/Copy';

export default function VaultSettings() {
  const vault = useVault();
  const chain = vault?.chain && getChainByName(vault?.chain ?? '');
  let accounts = useAccounts();
  accounts = accounts.map((account) => (chain ? getChainAccount(account, chain) : account));

  const onChange = () => {
    //
  };

  if (!vault || !chain) return null;

  return (
    <Box>
      <Title>Vault Settings</Title>
      <Summary data={vault} onChange={onChange} chain={chain} accounts={accounts} />

      <Stack direction="row" justifyContent="space-between" sx={{ pt: 3 }}>
        <Box sx={{ flex: '1 1 auto' }} /> {/* Right aligns the copy button */}
        <Copy text={JSON.stringify(vault, null, 4)} message="Vault copied">
          <Button variant="outlined" endIcon={<ContentCopyIcon />} sx={{ mb: 1, width: 'max-content' }}>
            Copy Vault
          </Button>
        </Copy>
      </Stack>
    </Box>
  );
}
