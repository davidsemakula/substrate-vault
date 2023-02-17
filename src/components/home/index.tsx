import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import ListVaults from '../vault/core/ListVaults';
import ActionCard, { Props as ActionCardProps } from './ActionCard';
import { APP_NAME } from '../../utils/constants';
import useIsMobile from '../../hooks/useIsMobile';
import { generateId } from '../../utils/helpers';
import Title from '../core/Title';

const ACTION_CARDS: Array<ActionCardProps> = [
  {
    title: 'Create Vault',
    description:
      'Create a new Vault with multiple approval policies. Each policy defines the signatories, threshold and the transaction type for which it applies.',
    action: 'Create Vault',
    icon: <AddCircleIcon />,
    path: '/new-vault/create',
  },
  {
    title: 'Import Vault',
    description: `Import an existing Vault either by address or as JSON shared by the the Vault's creator.`,
    action: 'Import Vault',
    icon: <FileDownloadIcon />,
    path: '/new-vault/import',
  },
];

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <Box>
      <Title sx={{ mb: 1 }}>Welcome to {APP_NAME}</Title>
      <Typography sx={{ mb: 4 }}>
        The easiest way to create and manage Substrate Vaults with complex hierarchical and granular transaction
        approval policies.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 5 }}>
        {ACTION_CARDS.map((action, idx) => (
          <Grid key={`action-card-${idx}-${generateId([action.title])}`} item xs={12} sm={6} lg={4} xl={3}>
            <ActionCard
              title={action.title}
              description={action.description}
              action={action.action}
              icon={action.icon}
              path={action.path}
            />
          </Grid>
        ))}
      </Grid>

      <Typography variant={isMobile ? 'h6' : 'h5'}>My Vaults</Typography>
      <Divider />
      <ListVaults />
    </Box>
  );
}
