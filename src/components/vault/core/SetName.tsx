import React, { ChangeEvent, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { StepProps } from '../../core/Steps';
import { Vault } from '../../../utils/types';

export default function SetName({ data, onChange }: StepProps<Vault>) {
  const [name, setName] = useState<string>(data?.name ?? '');
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value ?? '');
  };

  useEffect(() => {
    onChange(!!name, {
      ...data,
      name,
    });
  }, [name]);

  return (
    <Box component="form" noValidate autoComplete="off">
      <Typography variant="subtitle1" component="h2" sx={{ mb: 2 }}>
        Set a name for your Vault
      </Typography>
      <TextField
        id="name"
        label="Name"
        variant="outlined"
        value={name ?? ''}
        fullWidth={true}
        helperText="This name is only stored locally."
        onChange={handleChange}
      />
    </Box>
  );
}
