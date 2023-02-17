import React, { useMemo } from 'react';
import IdentityIcon from '@polkadot/react-identicon';
import { IconTheme } from '@polkadot/react-identicon/types';
import { SxProps, Theme } from '@mui/material';

import Icon from '../core/Icon';

type Props = {
  address: string;
  name?: string;
  size?: number;
  alt?: string;
  sx?: SxProps;
  theme?: IconTheme;
};

export default function AccountIcon({ address, name, size = 30, alt, sx, theme = 'polkadot' }: Props) {
  const [color, bgColor] = useMemo(() => {
    const color = (theme: Theme) => theme.palette.getContrastText(theme.palette.text.primary),
      bgColor = (theme: Theme) => theme.palette.text.primary;
    return [color, bgColor];
  }, []);

  return (
    <Icon src="" size={size} alt={name ?? alt} color={color} bgColor={bgColor} sx={sx}>
      <IdentityIcon value={address} size={size} theme={theme} />
    </Icon>
  );
}
