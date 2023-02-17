import React from 'react';
import { Outlet } from 'react-router-dom';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import useAccount from '../hooks/useAccount';
import useApi from '../hooks/useApi';
import useChain from '../hooks/useChain';
import Sidebar from './Sidebar';
import { DRAWER_WIDTH } from '../utils/constants';
import Loading from './status/Loading';
import UnsupportedChain from './status/UnsupportedChain';

export default function MainContent() {
  const chain = useChain();
  const account = useAccount();
  const { api, apiSupported } = useApi();
  const hideUI = !!(account && (!api || !apiSupported));

  const renderHiddenUIStatus = () => {
    if (!hideUI) return null;

    // Renders status of app if UI is hidden because of account or chain selection/switching
    if (!api || typeof apiSupported === 'undefined') {
      return <Loading message="Waiting for network connection ..." />;
    }

    // We're on an unsupported chain
    return <UnsupportedChain chain={chain} />;
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Container sx={{ mt: { xs: 2, sm: 4 }, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` } }} maxWidth="xl">
        <Paper sx={{ px: { xs: 2, sm: 4 }, py: 2 }}>
          {account ? (
            <Box hidden={hideUI}>
              {/* Hide UI when switching chains to allow children to maintain state/remain mounted */}
              <Outlet />
            </Box>
          ) : (
            <Loading message="Waiting for account selection ..." />
          )}
          {renderHiddenUIStatus()}
        </Paper>
      </Container>
    </Box>
  );
}
