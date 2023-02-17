import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { SxProps } from '@mui/material';

import AccountList from './AccountList';
import { Account, ChainInfo, Wallet } from '../../utils/types';
import { generateId } from '../../utils/helpers';

type Props = {
  account: Account;
  accounts: Array<Account>;
  wallets: Array<Wallet>;
  chain: ChainInfo;
  onChange: (account: Account) => void;
  onClose: () => void;
  sx?: SxProps;
};

export default function AccountSwitcher({ account, accounts, wallets, chain, onChange, onClose, sx }: Props) {
  const [wallet, setWallet] = useState<string>(account?.source ?? '');

  const handleWalletChange = (event: SelectChangeEvent<unknown>) => {
    setWallet(event.target.value as string);
  };

  useEffect(() => {
    if (account?.source && !wallet) {
      setWallet(account.source);
    }
  }, [account, wallet]);

  const walletAccounts: Array<Account> = useMemo(() => {
    return accounts.filter((item) => item?.source === wallet);
  }, [wallet, accounts]);

  return (
    <>
      <Stack sx={{ p: 2, ...sx }}>
        <FormControl sx={{ minWidth: '100%' }} size="small">
          <InputLabel id="wallet-select">Wallet</InputLabel>
          <Select
            labelId="wallet-select"
            id="wallet-select"
            value={wallet ?? ''}
            label="Wallet"
            onChange={handleWalletChange}
          >
            {wallets.map((wallet) => {
              return (
                <MenuItem key={`wallet-${wallet.name}-${generateId([wallet.name])}`} value={wallet.name}>
                  {wallet.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>

      <Box sx={{ maxHeight: '50vh', overflowY: 'auto' }}>
        <AccountList
          account={account}
          accounts={walletAccounts}
          chain={chain}
          onChange={(account) => {
            onChange(account);
            onClose();
          }}
        />
      </Box>
    </>
  );
}
