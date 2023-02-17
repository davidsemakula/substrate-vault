import React, { useMemo } from 'react';
import { namedLogos } from '@polkadot/apps-config/ui/logos';
import { chainColors } from '@polkadot/apps-config/ui/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import type { IconName } from '@fortawesome/fontawesome-svg-core';
import { SxProps, Theme } from '@mui/material';

import Icon from '../core/Icon';
import { parseHexColor } from '../../utils/helpers';

type Props = {
  name: string;
  size: number;
  text?: string;
  alt?: string;
  sx?: SxProps;
};

// Initialize Font Awesome
library.add(fas);

export default function ChainIcon({ name, text, size = 30, alt, sx }: Props) {
  const [src, chainColor, faIcon] = useMemo(() => {
    const chainLogo = namedLogos[name];
    const chainColor = chainColors[name] || (text && (chainColors[text] || chainColors[text.toLowerCase()]));
    const src = typeof chainLogo === 'string' ? chainLogo : '';
    const faIcon = typeof chainLogo !== 'string' ? (chainLogo as Record<string, string>)?.fa : '';
    return [src, chainColor, faIcon];
  }, [name, text]);

  const [color, bgColor] = useMemo(() => {
    let color, bgColor;
    if (!src) {
      // Only use font colors if chain has no image
      if (chainColor && !faIcon) {
        // For text based avatars, make background the chain color and pick a contrasting color for the font
        color = (theme: Theme) => theme.palette.getContrastText(parseHexColor(chainColor as string));
        bgColor = chainColor;
      } else {
        // For font-awesome icons (or when no chain color is found), set a high contrast background and opposite contrast text;
        color = (theme: Theme) => theme.palette.getContrastText(theme.palette.text.primary);
        bgColor = (theme: Theme) => theme.palette.text.primary;
      }
    }
    return [color, bgColor];
  }, [src, chainColor, faIcon]);

  return (
    <Icon src={src ?? ''} size={size} alt={alt} color={color} bgColor={bgColor} sx={sx}>
      {faIcon ? (
        <FontAwesomeIcon
          icon={faIcon as IconName}
          style={{ width: (size ?? 30) * 0.75, height: (size ?? 30) * 0.75 }}
        />
      ) : null}
    </Icon>
  );
}
