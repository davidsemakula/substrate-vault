import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SxProps } from '@mui/material';

type Props = {
  primary: string;
  secondary?: string;
  icon?: React.ReactElement | null;
  sx?: SxProps;
  className?: string;
};

export default function PickerDisplay({ primary, secondary, icon, sx, className }: Props) {
  return (
    <Box display="flex" flexDirection="row" alignItems="center" sx={{ minWidth: 130, ...sx }} className={className}>
      {icon ?? null}
      <Box flexGrow={1}>
        <Typography variant="body2" sx={secondary ? { lineHeight: 0.9 } : {}}>
          {primary}
        </Typography>
        {secondary ? (
          <Typography variant="caption" sx={{ lineHeight: 0.8 }}>
            {secondary}
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
}
