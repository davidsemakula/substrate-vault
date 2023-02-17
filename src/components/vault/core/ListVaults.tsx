import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import AvatarGroup from '@mui/material/AvatarGroup';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import LaunchIcon from '@mui/icons-material/Launch';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import AccountIcon from '../../accountPicker/AccountIcon';
import ChainIcon from '../../chainPicker/ChainIcon';
import Address from '../../core/Address';
import Copy from '../../core/Copy';
import { getChainByName, getDisplayName } from '../../../utils/helpers';
import { generatePolicyDeduplicationId, getVaultPathUrl } from '../../../utils/vault';
import useLocalVaults from '../../../hooks/useLocalVaults';

export default function ListVaults() {
  const vaults = useLocalVaults();
  const navigate = useNavigate();

  return (
    <>
      {vaults.length > 0 ? (
        <Grid container spacing={2} sx={{ py: 3 }}>
          {(vaults ?? []).map((vault, idx) => {
            const chain = getChainByName(vault.chain);
            const numPolicies = vault?.policies?.length;
            return (
              <Grid key={`vault-${idx}-${vault.address}`} item xs={12} sm={6} lg={4} xl={3}>
                <Paper sx={{ height: 1, display: 'flex', flexDirection: 'column' }} elevation={3}>
                  <Box flexGrow={1}>
                    <Stack alignItems="center" sx={{ px: 2, pt: 2, pb: 1 }}>
                      <AvatarGroup sx={{ alignItems: 'center', mb: 0.5 }}>
                        <AccountIcon address={vault.address ?? ''} name={vault?.name} alt={vault?.name} size={45} />
                        <ChainIcon
                          name={vault?.chain ?? ''}
                          size={45}
                          text={chain?.text ?? ''}
                          alt={chain?.text ?? ''}
                        />
                      </AvatarGroup>
                      <Typography variant="subtitle1" component="h6" sx={{ fontWeight: 500, mb: 0.5 }}>
                        {vault?.name}
                      </Typography>
                      <Address chain={chain} address={vault?.address ?? ''} maxLength={16} sx={{ mb: 0.5 }} />
                      <Typography
                        variant="body2"
                        component="h6"
                        sx={{ color: (theme) => theme.palette.text.secondary, fontWeight: 'normal', mb: 0.5 }}
                      >
                        on {chain?.text ? chain?.text : vault.chain}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Box sx={{ px: 2, py: 1 }}>
                      <Typography variant="body1" sx={{ mb: 0.5 }}>
                        {numPolicies} polic{numPolicies === 1 ? 'y' : 'ies'}
                      </Typography>
                      {(vault?.policies ?? []).map((policy, idx) => {
                        return (
                          <Box key={`policy-${idx}-${generatePolicyDeduplicationId(policy)}`}>
                            <Typography variant="body2">
                              {policy?.name ? policy?.name : `Policy #${idx}`}: {getDisplayName(policy?.type ?? '')} -{' '}
                              {policy?.signatories?.length === 1 ? (
                                '1 signatory'
                              ) : (
                                <>
                                  {policy.threshold}/{policy?.signatories?.length} multisig
                                </>
                              )}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ px: 2, pb: 2 }}>
                    <Button
                      variant="contained"
                      endIcon={<LaunchIcon />}
                      sx={{ mb: 1, width: 'max-content' }}
                      onClick={() => navigate(getVaultPathUrl(vault, '/settings'))}
                    >
                      Open Vault
                    </Button>

                    <Copy text={JSON.stringify(vault, null, 4)} message="Vault copied">
                      <Button variant="text" endIcon={<ContentCopyIcon />} sx={{ mb: 1, width: 'max-content' }}>
                        Copy Vault
                      </Button>
                    </Copy>
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
          <SentimentSatisfiedAltIcon color="primary" fontSize="large" sx={{ mb: 1 }} />
          <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
            Your Vaults will appear here.
          </Typography>
        </Stack>
      )}
    </>
  );
}
