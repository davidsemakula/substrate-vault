import React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import AccountInfo from './AccountInfo';
import AccountSwitcher from './AccountSwitcher';
import { Account, ChainInfo, Wallet } from '../../utils/types';

type Props = {
  account: Account;
  accounts: Array<Account>;
  wallets: Array<Wallet>;
  chain: ChainInfo;
  onChange: (account: Account) => void;
  onClose: () => void;
};

export default function AccountPopup({ account, accounts, wallets, chain, onChange, onClose }: Props) {
  return (
    <Box>
      <AccountInfo account={account} chain={chain} sx={{ p: 2 }} />
      <Divider />
      <AccountSwitcher
        account={account}
        accounts={accounts}
        wallets={wallets}
        chain={chain}
        onChange={onChange}
        onClose={onClose}
      />
    </Box>
  );
}
