import React, { ChangeEvent, ReactElement } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ContactsIcon from '@mui/icons-material/Contacts';
import SettingsIcon from '@mui/icons-material/Settings';

import useAppStatus from '../hooks/useAppStatus';
import { DRAWER_WIDTH } from '../utils/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import useVault from '../hooks/useVault';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import useLocalVaults from '../hooks/useLocalVaults';
import { getVaultId } from '../services/storage';
import AvatarGroup from '@mui/material/AvatarGroup';
import AccountIcon from './accountPicker/AccountIcon';
import ChainIcon from './chainPicker/ChainIcon';
import { truncateAddress } from '../utils/helpers';
import Typography from '@mui/material/Typography';

type NavItemType = {
  title: string;
  icon: ReactElement;
  path: string;
  disabled?: boolean;
};

export default function Sidebar() {
  const { drawerOpen, toggleDrawer } = useAppStatus();
  const navigate = useNavigate();
  const vault = useVault();
  const location = useLocation();
  const vaults = useLocalVaults();

  const getVaultAwarePath = (path: string) =>
    vault?.chain && vault?.address ? `/${vault?.chain}:${vault?.address}${path}` : '/';

  const handleVaultChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newVaultId = event.target.value;
    if (newVaultId) {
      navigate(`/${newVaultId}/settings`);
    }
  };

  const renderList = (items: Array<NavItemType>) => {
    return items.map((item) => {
      return (
        <ListItem key={item.title} disablePadding>
          <ListItemButton
            onClick={() => navigate(item.path)}
            selected={!!(item.path && location.pathname === item.path)}
            disabled={item.disabled}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItemButton>
        </ListItem>
      );
    });
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {renderList([
          {
            title: 'Home',
            icon: <HomeIcon />,
            path: '/',
          },
        ])}
      </List>
      <Divider />
      <List>
        <ListItem>
          <TextField
            id="vault"
            select
            label="Vault"
            value={vault ? getVaultId(vault, ':') : ''}
            size="small"
            onChange={handleVaultChange}
            fullWidth={true}
          >
            {(vaults ?? []).map((vault) => {
              const truncatedAddress = truncateAddress(vault?.address ?? '');
              const primary = vault?.name ? vault?.name : truncatedAddress,
                secondary = vault?.name ? truncatedAddress : '';
              return (
                <MenuItem key={`vault-${getVaultId(vault)}`} value={vault ? getVaultId(vault, ':') : ''}>
                  <Stack direction="row">
                    <AvatarGroup sx={{ mr: 0.5 }}>
                      <AccountIcon address={vault?.address ?? ''} size={25} />
                      <ChainIcon name={vault?.chain ?? ''} size={25} />
                    </AvatarGroup>

                    <Box flexGrow={1}>
                      <Typography variant="body2" sx={secondary ? { lineHeight: 0.9 } : {}}>
                        {primary}
                      </Typography>
                      {secondary ? (
                        <Typography variant="caption" sx={{ lineHeight: 0.8 }}>
                          {secondary}
                        </Typography>
                      ) : null}
                    </Box>
                  </Stack>
                </MenuItem>
              );
            })}
          </TextField>
        </ListItem>
        <Divider />
        <ListItem>
          <Stack sx={{ width: '100%' }}>
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={() => navigate('/new-vault/create')}
              sx={{ mb: 1 }}
            >
              Create Vault
            </Button>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={() => navigate('/new-vault/import')}
              sx={{ mb: 1 }}
            >
              Import Vault
            </Button>
          </Stack>
        </ListItem>
      </List>
      <Divider />
      <List>
        {renderList([
          {
            title: 'Assets',
            icon: <MonetizationOnIcon />,
            path: getVaultAwarePath('/assets'),
            disabled: !vault,
          },
          {
            title: 'Transactions',
            icon: <SwapHorizIcon />,
            path: getVaultAwarePath('/transactions'),
            disabled: !vault,
          },
          {
            title: 'Address Book',
            icon: <ContactsIcon />,
            path: getVaultAwarePath('/address-book'),
            disabled: !vault,
          },
        ])}
      </List>
      <Divider />
      <List>
        {renderList([
          {
            title: 'Settings',
            icon: <SettingsIcon />,
            path: getVaultAwarePath('/settings'),
            disabled: !vault,
          },
        ])}
      </List>
    </div>
  );

  return (
    <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { sm: 0 } }} aria-label="sidebar">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
