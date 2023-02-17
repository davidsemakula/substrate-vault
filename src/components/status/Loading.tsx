import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

type Props = {
  message: string;
};

export default function Loading({ message }: Props) {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
      <CircularProgress sx={{ mb: 2 }} />
      <Typography component="p">{message}</Typography>
    </Stack>
  );
}
