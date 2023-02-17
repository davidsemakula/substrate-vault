import React, { ReactElement, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import { StepProps } from '../../core/Steps';
import { Vault } from '../../../utils/types';
import { generateId, getDisplayName, truncateAddress } from '../../../utils/helpers';
import AccountIcon from '../../accountPicker/AccountIcon';
import { SxProps } from '@mui/material';
import { generatePolicyDeduplicationId, getChainVault, isValidCreationVault } from '../../../utils/vault';
import { UserContextType } from '../../../context/types';
import ChainIcon from '../../chainPicker/ChainIcon';
import Address from '../../core/Address';
import useIsMobile from '../../../hooks/useIsMobile';

interface Props extends StepProps<Vault>, UserContextType {
  title?: string;
}

type RowProps = {
  label: string;
  content: ReactElement | string;
  fullWidth?: boolean;
  sx?: SxProps;
};

const Row = ({ label, content, fullWidth, sx }: RowProps) => (
  <Grid container gap={2} sx={sx}>
    <Grid item xs={fullWidth ? 12 : 'auto'} sm={2}>
      {label}
    </Grid>
    <Grid item xs={fullWidth ? 12 : 'auto'} sm={9}>
      {content}
    </Grid>
  </Grid>
);

export default function Summary({ data, chain, title, onChange }: Props) {
  const isMobile = useIsMobile();
  const vault = useMemo(() => {
    // Clean vault on initial load and on chain changes
    return getChainVault(data, chain);
  }, [chain]);
  const policies = vault?.policies ?? [];

  useEffect(() => {
    // Confirm that the vault is ready to create if it's valid
    onChange(isValidCreationVault(vault), vault);
  }, [vault]);

  return (
    <Box>
      {title ? (
        <Typography variant="subtitle1" component="h2" sx={{ mb: 2 }}>
          {title}
        </Typography>
      ) : null}

      <Box>
        <Row label="Name:" content={<Typography fontWeight="500">{vault?.name ?? ''}</Typography>} sx={{ mb: 1 }} />
        {vault?.address ? (
          <Row
            label="Address:"
            content={
              <Stack direction="row" alignItems="center">
                <AccountIcon address={vault?.address ?? ''} size={30} sx={{ mr: 1 }} />
                <Typography sx={{ mr: 1 }}>{truncateAddress(vault?.address ?? '', isMobile ? 10 : 16)}</Typography>
                <Address address={vault?.address ?? ''} text="Copy" />
              </Stack>
            }
            sx={{ mb: 1 }}
          />
        ) : null}
        <Row
          label="Chain:"
          content={
            <Stack direction="row" alignItems="center">
              <ChainIcon name={chain?.info ?? ''} size={30} sx={{ mr: 1 }} />
              <Typography>{chain?.text ?? ''}</Typography>
            </Stack>
          }
          sx={{ mb: 1 }}
        />
        <Row
          label="Policies:"
          fullWidth={true}
          content={
            <Box>
              {policies.map((policy, idx) => {
                const signatories = policy?.signatories ?? [],
                  numSignatories = signatories.length;
                return (
                  <Paper key={`policy-${idx}-${generatePolicyDeduplicationId(policy)}`} sx={{ p: 2, mb: 2 }}>
                    <Grid container gap={2}>
                      <Row label="Policy Name:" content={policy?.name ? policy?.name : `Policy #${idx + 1}`} />
                      <Row label="Transaction Type:" content={policy?.type ? getDisplayName(policy?.type) : ''} />
                      <Row
                        label="Signatories:"
                        fullWidth={true}
                        content={
                          <>
                            {signatories.map((signatory, subIdx) => {
                              const truncatedAddress = truncateAddress(signatory?.address ?? '', 16);
                              const primary = signatory?.name ? signatory?.name : truncatedAddress,
                                secondary = signatory?.name ? truncatedAddress : '';
                              return (
                                <Stack
                                  key={`signatory-${subIdx}-${generateId([signatory?.address, signatory?.name])}`}
                                  direction="row"
                                  alignItems="center"
                                >
                                  <AccountIcon address={signatory?.address ?? ''} sx={{ mr: 2 }} />
                                  <Box>
                                    <Typography>{primary}</Typography>
                                    {secondary ? <Typography variant="caption">{secondary}</Typography> : null}
                                  </Box>
                                </Stack>
                              );
                            })}
                          </>
                        }
                      />
                      <Row
                        label="Threshold:"
                        content={
                          policy?.threshold
                            ? `${policy?.threshold} (out of ${numSignatories} signator${
                                numSignatories === 1 ? 'y' : 'ies'
                              })`
                            : ''
                        }
                      />
                    </Grid>
                  </Paper>
                );
              })}
            </Box>
          }
        />
      </Box>
    </Box>
  );
}
