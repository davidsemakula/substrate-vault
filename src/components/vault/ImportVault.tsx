import React, { ChangeEvent, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import Title from '../core/Title';
import useUnsetVault from '../../hooks/useUnsetVault';
import { getVaultPathUrl, isValidEditAndImportVault } from '../../utils/vault';
import { Vault } from '../../utils/types';
import Alert from '@mui/material/Alert';
import storage from '../../services/storage';
import { useNavigate } from 'react-router-dom';

const INVALID_VAULT_DEFINITION = 'Invalid Vault definition.';
const INVALID_VAULT_FORMAT = 'IInvalid format for Vault definition.';

export default function ImportVault() {
  useUnsetVault();
  const [data, setData] = useState<Vault>();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    let newError = '',
      newData = null;
    setSuccess(false);

    if (value) {
      try {
        const data = JSON.parse(value);
        if (isValidEditAndImportVault(data)) {
          newData = data;
        } else {
          newError = INVALID_VAULT_DEFINITION;
        }
      } catch (e) {
        newError = INVALID_VAULT_FORMAT;
      }
    }

    setError(newError);
    setData(newData);
  };

  const handleSave = () => {
    if (data && isValidEditAndImportVault(data)) {
      storage.saveVault(data);
      setSuccess(true);
    } else {
      setError(INVALID_VAULT_DEFINITION);
    }
  };

  useEffect(() => {
    if (success && data) {
      setTimeout(() => {
        navigate(getVaultPathUrl(data, '/settings'));
      }, 2000);
    }
  }, [success]);

  return (
    <Box>
      <Title>Import Vault</Title>

      {data ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          Your Vault is ready to be imported.
        </Alert>
      ) : null}

      <Box component="form" noValidate autoComplete="off">
        <TextField
          id="vault-data"
          label="Vault Definition"
          multiline
          rows={6}
          error={!!error}
          helperText={error || 'Paste the Vault definition that was shared with you into the text field above'}
          fullWidth={true}
          onChange={handleTextChange}
        />
      </Box>

      <Stack direction="row">
        <Box sx={{ flex: '1 1 auto' }} /> {/* Right aligns the submit button */}
        <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleSave} disabled={!!(error || !data)}>
          Import
        </Button>
      </Stack>
    </Box>
  );
}
