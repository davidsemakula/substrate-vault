import React from 'react';
import { SxProps } from '@mui/material';

import Picker from '../core/Picker';
import AccountIcon from './AccountIcon';
import AccountPopup from './AccountPopup';
import { Account, ChainInfo, Wallet } from '../../utils/types';
import { getChainAddress, truncateAddress } from '../../utils/helpers';

type Props = {
  account?: Account;
  accounts: Array<Account>;
  wallets: Array<Wallet>;
  chain: ChainInfo;
  onChange: (account: Account) => void;
  sx?: SxProps;
  className?: string;
};
export default function AccountPicker({ account, accounts, wallets, chain, onChange, sx, className }: Props) {
  const label = account?.name
    ? [account?.name, account?.source ? `(${account?.source})` : ''].filter(Boolean).join(' ')
    : account?.address;
  return (
    <Picker
      primaryLabel={label ?? 'Account'}
      secondaryLabel={
        account?.name && account?.address
          ? truncateAddress(getChainAddress(account?.address ?? '', chain))
          : account?.source ?? ''
      }
      dropdown={AccountPopup}
      dropdownProps={{
        account,
        accounts,
        wallets,
        chain,
        onChange,
      }}
      icon={
        account && (
          <AccountIcon
            address={account?.address ?? ''}
            name={account?.name ?? ''}
            size={30}
            alt={account?.name}
            sx={{ mr: 1 }}
          />
        )
      }
      sx={sx}
      className={className}
    />
  );
}
