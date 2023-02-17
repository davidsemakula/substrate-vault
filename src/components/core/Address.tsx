import React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { SxProps } from '@mui/material';

import { getChainAddress, truncateAddress } from '../../utils/helpers';
import { ChainInfo } from '../../utils/types';
import Copy from './Copy';

const StyledButton = styled(Button)(({ theme }) => ({
  color: 'inherit',
  fontWeight: 'normal',
  textTransform: 'none',
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius * 2,
  ':hover, :focus': {
    color: 'inherit',
    borderColor: theme.palette.divider,
  },
}));

type Props = {
  address: string;
  text?: string;
  chain?: ChainInfo;
  maxLength?: number;
  sx?: SxProps;
};

export default function Address({ address, text, chain, maxLength = 10, sx }: Props): React.ReactElement {
  return (
    <Copy text={address} message="Address copied" sx={sx}>
      <StyledButton variant="outlined" endIcon={<ContentCopyIcon />} size="small" disableElevation={true}>
        {text || truncateAddress(chain ? getChainAddress(address ?? '', chain) : address, maxLength)}
      </StyledButton>
    </Copy>
  );
}
