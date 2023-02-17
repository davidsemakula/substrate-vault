import React from 'react';
import Avatar from '@mui/material/Avatar';
import { SxProps, Theme } from '@mui/material';

type Props = {
  src: string;
  size?: number;
  text?: string;
  alt?: string;
  color?: string | ((theme: Theme) => string);
  bgColor?: string | ((theme: Theme) => string);
  sx?: SxProps;
  children?: React.ReactElement | null;
};

export default function Icon({
  src,
  size = 30,
  text = '',
  alt = '',
  color = '',
  bgColor = '',
  sx = {},
  children,
}: Props) {
  return (
    <Avatar
      src={src}
      sx={{
        fontSize: (size ?? 30) * 0.75,
        width: size ?? 30,
        height: size ?? 30,
        ...sx,
        color: color,
        backgroundColor: bgColor,
      }}
    >
      {children || ((text || alt) ?? 'A').charAt(0).toUpperCase()}
    </Avatar>
  );
}
