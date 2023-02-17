import React, { ChangeEvent, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { isAddress } from '@polkadot/util-crypto';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import AccountIcon from '../../accountPicker/AccountIcon';
import { Account, Policy, ChainInfo, Signatory, TransactionType } from '../../../utils/types';
import { generateId, getDisplayName, truncateAddress } from '../../../utils/helpers';
import { getChainPolicy, getChainSignatories } from '../../../utils/vault';
import FormLabel from '@mui/material/FormLabel';

type Props = {
  data: Policy;
  chain: ChainInfo;
  accounts: Array<Account>;
  onChange: (data: Policy) => void;
};

export default function ManagePolicy({ data, chain, accounts, onChange }: Props) {
  const [policy, setPolicy] = useState<Policy>(data);
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const handlePolicyNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPolicy({
      ...policy,
      name: e.target.value ?? '',
    });
  };

  const handleTransactionTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTransactionType = e.target.value ?? '';
    setPolicy({
      ...policy,
      type:
        newTransactionType && Object.values(TransactionType).includes(newTransactionType as TransactionType)
          ? (newTransactionType as TransactionType)
          : TransactionType.any,
    });
  };

  const cleanSignatories = (signatories: Array<Signatory>) => {
    return getChainSignatories(
      _.uniqWith(signatories, (value, other) => {
        // Remove duplicates by address, but leave empty entries
        if (!value?.address && !value?.name) {
          return false;
        }
        return _.isEqual(value?.address, other?.address);
      }),
      chain,
    );
  };

  const addOrUpdateSignatory = (signatory: Signatory, idx?: number) => {
    const signatories = [...(policy?.signatories ?? [])];
    if (typeof idx === 'number') {
      signatories[idx] = signatory;
    } else {
      signatories.push(signatory);
    }
    const newPolicy = {
      ...policy,
      signatories: cleanSignatories(signatories),
    };
    setPolicy(newPolicy);
  };

  const removeSignatory = (idx: number) => {
    let signatories = [...(policy?.signatories ?? [])];
    if (idx < signatories.length) {
      signatories = [...signatories.slice(0, idx), ...signatories.slice(idx + 1)];
    }

    const newPolicy = {
      ...policy,
      signatories: cleanSignatories(signatories),
      threshold: (policy?.threshold > signatories.length ? signatories.length : policy?.threshold) ?? 0,
    };
    setPolicy(newPolicy);
  };

  const handleAddSignatory = () => {
    // Add an empty signatory
    addOrUpdateSignatory({ name: '', address: '' });
  };

  const handleAccountSuggestionsChange = (idx: number) => (e: SyntheticEvent, address: string | null) => {
    const signatory: Signatory = policy?.signatories[idx];
    const updatedSignatory = { ...signatory, address: address ?? '' };
    const info = accountOptions.find((i) => i?.address === address);
    if (info?.name) {
      updatedSignatory.name = info?.name;
    }
    addOrUpdateSignatory(updatedSignatory, idx);
  };

  const handleAccountInputChange = (idx: number) => (e: SyntheticEvent, address: string | null, reason: string) => {
    const signatory: Signatory = policy?.signatories[idx];
    addOrUpdateSignatory({ ...signatory, address: address && reason === 'input' ? address : '' }, idx);
  };

  const handleAccountNameChange = (idx: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const signatory: Signatory = policy?.signatories[idx];
    addOrUpdateSignatory({ ...signatory, name: e.target.value ?? '' }, idx);
  };

  const handleThresholdChange = (event: ChangeEvent<HTMLInputElement>) => {
    const threshold = parseInt(event.target.value);
    if (threshold) {
      const newPolicy = {
        ...policy,
        threshold,
      };
      setPolicy(newPolicy);
    }
  };

  useEffect(() => {
    onChange(policy);

    // Validate address
    const allNonEmptyAddresses: Array<string> = _.uniq(
      (policy?.signatories ?? []).map((signatory) => signatory?.address ?? ''),
    ).filter(Boolean);
    const newAddressErrors: Record<string, string> = {};
    for (const address of allNonEmptyAddresses) {
      if (!isAddress(address ?? '')) {
        newAddressErrors[address] = 'Invalid address';
      }
    }
    setAddressErrors(newAddressErrors);
  }, [policy]);

  useEffect(() => {
    // Update policy when chain changes
    setPolicy(getChainPolicy(policy, chain));
  }, [chain]);

  const accountOptions: Array<Account> = useMemo(() => {
    const signatories = policy?.signatories ?? [];
    const signatoryAddresses = signatories.map((i) => i?.address).filter(Boolean);
    return (accounts ?? []).filter((item) => !signatoryAddresses.includes(item?.address));
  }, [accounts, policy?.signatories]);

  const [numSignatories, numNonEmptySignatories] = useMemo(() => {
    const signatories = policy?.signatories ?? [];
    return [signatories.length, signatories.filter((signatory) => signatory?.address).length];
  }, [policy?.signatories]);

  return (
    <Box component="form" noValidate autoComplete="off">
      <Typography variant="body1" component="p" sx={{ mb: 2 }}>
        Set the policy name, transaction type, signatories and the number of approvals (threshold) required for this
        policy
      </Typography>

      <TextField
        id="policy-name"
        label="Policy Name"
        placeholder="Policy Name e.g Finance or Executives"
        variant="outlined"
        value={policy?.name ?? ''}
        fullWidth={true}
        onChange={handlePolicyNameChange}
        sx={{ mb: 2 }}
      />

      <TextField
        id="transaction-type"
        select
        label="Transaction Type"
        variant="outlined"
        value={policy?.type ?? ''}
        onChange={handleTransactionTypeChange}
        fullWidth={true}
        sx={{ my: 2 }}
      >
        {Object.values(TransactionType).map((value, idx) => {
          return (
            <MenuItem key={`transaction-type-${idx}-${generateId([value])}`} value={value}>
              {getDisplayName(value)}
            </MenuItem>
          );
        })}
      </TextField>

      <Divider />

      <Box sx={{ my: 2 }}>
        <Box sx={{ mb: 1 }}>
          <FormLabel>Signatories</FormLabel>
        </Box>

        {(policy?.signatories ?? []).map((signatory: Signatory, idx) => {
          const address = signatory?.address ?? '',
            error = address ? addressErrors[address] : '';
          return (
            <Stack
              key={`signatory-${idx}-${generateId([address, signatory?.name])}`}
              alignItems="flex-start"
              gap={2}
              sx={{ flexDirection: { sm: 'row' }, mb: { xs: 3, sm: 2 } }}
            >
              <Autocomplete
                id="account"
                freeSolo
                inputValue={address}
                options={accountOptions.map((option) => option?.address)}
                renderOption={(props, option: string) => {
                  const info = accountOptions.find((i) => i?.address === option);
                  const truncatedAddress = truncateAddress(option ?? '', 16);
                  const primary = info?.name
                    ? [info?.name, info?.source ? `(${info?.source})` : ''].filter(Boolean).join(' ')
                    : truncatedAddress;
                  const secondary = info?.name ? truncatedAddress : '';
                  return (
                    <MenuItem {...props}>
                      <Stack direction="row">
                        <AccountIcon address={option} sx={{ mr: 1 }} />
                        <Stack>
                          <Typography variant="body1" component="div">
                            {primary}
                          </Typography>
                          <Typography variant="caption" component="div">
                            {secondary}
                          </Typography>
                        </Stack>
                      </Stack>
                    </MenuItem>
                  );
                }}
                renderInput={(params) => {
                  const value = params?.inputProps?.value;
                  return (
                    <TextField
                      {...params}
                      label={`Account #${idx + 1}`}
                      InputProps={{
                        ...params?.InputProps,
                        startAdornment: value ? (
                          <InputAdornment position="start">
                            <AccountIcon address={(value as string) ?? ''} />
                          </InputAdornment>
                        ) : (
                          params?.InputProps.startAdornment
                        ),
                      }}
                      error={!!error}
                      helperText={error ?? ''}
                    />
                  );
                }}
                onChange={handleAccountSuggestionsChange(idx)}
                onInputChange={handleAccountInputChange(idx)}
                fullWidth={true}
                sx={{ flexGrow: 1, sm: { maxWidth: '50%' } }}
              />

              <Stack direction="row" flexGrow={1} sx={{ width: '100%', sm: { maxWidth: '50%' } }}>
                <TextField
                  id="signatory-name"
                  label={`Name #${idx + 1}`}
                  variant="outlined"
                  value={signatory?.name ?? ''}
                  onChange={handleAccountNameChange(idx)}
                  fullWidth={true}
                  sx={{ flexGrow: 1 }}
                />

                {idx > 0 || numSignatories > 1 ? (
                  <IconButton
                    color="primary"
                    aria-label="Remove signatory"
                    component="label"
                    onClick={() => removeSignatory(idx)}
                    sx={{ flexGrow: 0 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                ) : null}
              </Stack>
            </Stack>
          );
        })}

        <Button variant="text" startIcon={<AddIcon />} onClick={handleAddSignatory}>
          Add Signatory
        </Button>
      </Box>

      <Divider />

      <Box sx={{ mt: 2 }}>
        {policy?.threshold < 2 ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            A threshold higher than is recommended one to prevent this policy from losing access to the Vault in case a
            signatory's key is lost or compromised.
          </Alert>
        ) : policy?.threshold === numSignatories ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Having more signatories than the threshold is recommended to prevent this policy from losing access to the
            Vault in case a signatory's key is lost or compromised.
          </Alert>
        ) : null}

        <TextField
          id="threshold"
          select
          label="Threshold"
          value={policy?.threshold ?? ''}
          helperText="Number of approvals required"
          size="small"
          onChange={handleThresholdChange}
          sx={{ mr: 2 }}
        >
          {_.range(1, numNonEmptySignatories + 1).map((value) => (
            <MenuItem key={`threshold-${value}`} value={value}>
              {value}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Box>
  );
}
