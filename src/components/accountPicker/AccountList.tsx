import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';

import AccountIcon from './AccountIcon';
import { Account, ChainInfo } from '../../utils/types';
import { generateId, getChainAddress, truncateAddress } from '../../utils/helpers';

type Props = {
  account: Account;
  accounts: Array<Account>;
  chain: ChainInfo;
  onChange: (account: Account) => void;
};

export default function AccountList({ account, accounts, chain, onChange }: Props) {
  return (
    <List dense={true}>
      <ListSubheader disableSticky={true}>Accounts</ListSubheader>
      {accounts.map((item, idx) => (
        <ListItem key={`account-${idx}-${generateId([item.address, account?.source])}`} disablePadding>
          <ListItemButton
            selected={item.address === account.address && item?.source === account?.source}
            onClick={() => onChange(item)}
          >
            <ListItemIcon>
              <AccountIcon address={item.address} name={item?.name ?? ''} size={30} alt={item?.name} />
            </ListItemIcon>
            <ListItemText
              primary={item?.name}
              secondary={truncateAddress(getChainAddress(item?.address ?? '', chain), 16)}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
