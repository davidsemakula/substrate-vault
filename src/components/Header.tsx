import React from 'react';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuIcon from '@mui/icons-material/Menu';

import LogoIcon from '../icons/Logo';
import ComboPicker from './comboPicker';
import { ColorMode } from '../utils/types';
import { APP_NAME } from '../utils/constants';
import useChain from '../hooks/useChain';
import useAccount from '../hooks/useAccount';
import useAccounts from '../hooks/useAccounts';
import useWallets from '../hooks/useWallets';
import useSetUserContext from '../hooks/useSetUserContext';
import useAppStatus from '../hooks/useAppStatus';

export default function Header(): React.ReactElement {
  const theme = useTheme();
  const chain = useChain();
  const account = useAccount();
  const accounts = useAccounts();
  const wallets = useWallets();
  const { setChain, setAccount } = useSetUserContext();
  const { toggleColorMode, toggleDrawer } = useAppStatus();

  const goHome = () => {
    // go home
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" enableColorOnDark={true} sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 1, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <LogoIcon fontSize="large" sx={{ mr: 1, display: { xs: 'none', md: 'block' } }} />
          <Typography
            variant="body1"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, mr: 2, ':hover': { cursor: 'pointer' } }}
            onClick={goHome}
          >
            {APP_NAME}
          </Typography>
          <Box sx={{ flexGrow: 1 }} /> {/* Spacer */}
          <ComboPicker
            account={account}
            accounts={accounts}
            wallets={wallets}
            chain={chain}
            onChangeAccount={setAccount}
            onChangeChain={setChain}
            sx={{ mr: 1 }}
          />
          <Box sx={{ flexGrow: { xs: 1, sm: 0 } }} /> {/* Spacer */}
          <Tooltip
            title={`Switch to ${theme.palette.mode === ColorMode.dark ? ColorMode.light : ColorMode.dark} theme.`}
          >
            <IconButton onClick={() => toggleColorMode()} color="inherit">
              {theme.palette.mode === ColorMode.dark ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* Spacer */}
    </Box>
  );
}
