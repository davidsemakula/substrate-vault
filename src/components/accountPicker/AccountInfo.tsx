import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
import { SxProps } from '@mui/material';

import AccountIcon from './AccountIcon';
import { Account, ChainInfo } from '../../utils/types';
import Address from '../core/Address';
import ChainIcon from '../chainPicker/ChainIcon';
import useIsMobile from '../../hooks/useIsMobile';

type Props = {
  account: Account;
  chain: ChainInfo;
  sx?: SxProps;
};

export default function AccountInfo({ account, chain, sx }: Props) {
  const isMobile = useIsMobile();

  return (
    <Stack alignItems="center" sx={sx}>
      {isMobile ? null : (
        <AvatarGroup sx={{ alignItems: 'center', mb: 0.5 }}>
          <AccountIcon address={account?.address ?? ''} name={account?.name} alt={account?.name} size={45} />
          <ChainIcon name={chain?.info ?? ''} size={45} text={chain?.text ?? ''} alt={chain?.text ?? ''} />
        </AvatarGroup>
      )}
      <Typography variant="subtitle1" component="h6" sx={{ fontWeight: 500, mb: 0.5 }}>
        {account?.name} ({account?.source})
      </Typography>
      <Address chain={chain} address={account?.address ?? ''} maxLength={16} sx={{ mb: 0.5 }} />
      <Typography
        variant="body2"
        component="h6"
        sx={{ color: (theme) => theme.palette.text.secondary, fontWeight: 'normal', mb: 0.5 }}
      >
        on {chain?.text} (via {chain?.provider?.name})
      </Typography>
    </Stack>
  );
}
