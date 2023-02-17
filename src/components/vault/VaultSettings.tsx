import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';

import Summary from './core/Summary';
import useVault from '../../hooks/useVault';
import useAccounts from '../../hooks/useAccounts';
import { getChainAccount, getChainByName } from '../../utils/helpers';
import Title from '../core/Title';
import Copy from '../core/Copy';
import { useNavigate } from 'react-router-dom';
import { getVaultPathUrl } from '../../utils/vault';

export default function VaultSettings() {
  const navigate = useNavigate();
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

      <Stack direction="row" justifyContent="space-between" sx={{ pt: 3, mb: 1 }}>
        <Box sx={{ flex: '1 1 auto' }} /> {/* Right aligns the copy button */}
        <Copy text={JSON.stringify(vault, null, 4)} message="Vault copied">
          <Button variant="outlined" endIcon={<ContentCopyIcon />} sx={{ mr: 1 }}>
            Copy Vault
          </Button>
        </Copy>
        <Button
          variant="contained"
          endIcon={<EditIcon />}
          onClick={() => vault && navigate(getVaultPathUrl(vault, '/edit'))}
        >
          Edit Vault
        </Button>
      </Stack>
    </Box>
  );
}
