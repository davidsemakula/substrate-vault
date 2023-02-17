import React from 'react';
import { alpha } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import AvatarGroup from '@mui/material/AvatarGroup';
import { SxProps } from '@mui/material';

import Picker from '../core/Picker';
import PickerDisplay from '../core/Picker/PickerDisplay';
import ComboPopup from './ComboPopup';
import AccountIcon from '../accountPicker/AccountIcon';
import ChainIcon from '../chainPicker/ChainIcon';
import { Account, ChainInfo, Wallet } from '../../utils/types';
import { getChainAddress, truncateAddress } from '../../utils/helpers';
import useIsMobile from '../../hooks/useIsMobile';

type Props = {
  account?: Account | null;
  chain: ChainInfo;
  accounts: Array<Account>;
  wallets: Array<Wallet>;
  onChangeAccount: (account: Account) => void;
  onChangeChain: (chain: ChainInfo) => void;
  sx?: SxProps;
  className?: string;
};
export default function ComboPicker({
  account,
  chain,
  accounts,
  wallets,
  onChangeAccount,
  onChangeChain,
  sx,
  className,
}: Props) {
  const isMobile = useIsMobile();
  const truncatedAddress = account?.address ? truncateAddress(getChainAddress(account?.address ?? '', chain)) : '';
  const label = account?.name
    ? [account?.name, account?.source ? `(${account?.source})` : ''].filter(Boolean).join(' ')
    : truncatedAddress;

  const accountIcon = account && (
    <AccountIcon
      address={account?.address ?? ''}
      name={account?.name ?? ''}
      size={30}
      alt={account?.name}
      sx={{ mr: { sm: 1 } }}
    />
  );
  const chainIcon = (
    <ChainIcon name={chain?.info ?? ''} size={30} text={chain?.text} alt={chain?.text} sx={{ mr: { sm: 1 } }} />
  );

  return (
    <Picker
      primaryLabel={isMobile ? [account?.name ?? 'Account', chain?.text ?? 'Network'].join(' | ') : ''}
      secondaryLabel={isMobile ? truncatedAddress : ''}
      display={
        isMobile ? null : (
          <Stack
            direction="row"
            divider={
              <Divider
                orientation="vertical"
                flexItem={true}
                sx={{ backgroundColor: (theme) => alpha(theme.palette.primary.contrastText, 0.4) }}
              />
            }
            spacing={1}
          >
            <PickerDisplay
              primary={label ?? 'Account'}
              secondary={account?.name && account?.address ? truncatedAddress : account?.source ?? ''}
              icon={accountIcon}
            />
            <PickerDisplay
              primary={chain?.text ?? 'Network'}
              secondary={chain?.provider?.name ? `via ${chain?.provider?.name}` : ''}
              icon={chainIcon}
            />
          </Stack>
        )
      }
      dropdown={ComboPopup}
      dropdownProps={{
        account,
        accounts,
        wallets,
        chain,
        onChangeAccount,
        onChangeChain,
      }}
      icon={
        isMobile ? (
          <AvatarGroup sx={{ mr: 1 }}>
            {accountIcon}
            {chainIcon}
          </AvatarGroup>
        ) : null
      }
      sx={sx}
      className={className}
    />
  );
}
