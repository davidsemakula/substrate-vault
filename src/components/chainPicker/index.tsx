import React from 'react';
import { SxProps } from '@mui/material';

import Picker from '../core/Picker';
import ChainIcon from './ChainIcon';
import ChainSwitcher from './ChainSwitcher';
import { ChainInfo } from '../../utils/types';

type Props = {
  chain: ChainInfo;
  onChange: (chain: ChainInfo) => void;
  sx?: SxProps;
  className?: string;
};
export default function ChainPicker({ chain, onChange, sx, className }: Props) {
  return (
    <Picker
      primaryLabel={chain?.text ?? 'Network'}
      secondaryLabel={chain?.provider?.name ? `via ${chain?.provider?.name}` : ''}
      dropdown={ChainSwitcher}
      dropdownProps={{
        chain,
        onChange,
      }}
      icon={<ChainIcon name={chain?.info ?? ''} size={30} text={chain?.text} alt={chain?.text} sx={{ mr: 1 }} />}
      sx={sx}
      className={className}
    />
  );
}
