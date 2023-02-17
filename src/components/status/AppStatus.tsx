import React, { ReactElement } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

type Props = {
  icon?: ReactElement | null;
  title: string;
  subtitle?: string;
};

export default function AppStatus({ icon, title, subtitle }: Props) {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
      {icon}
      <Typography variant="h6" sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      {subtitle ? <Typography variant="body2">{subtitle}</Typography> : null}
    </Stack>
  );
}
