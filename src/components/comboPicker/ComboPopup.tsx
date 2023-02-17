import React, { SyntheticEvent, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import HubIcon from '@mui/icons-material/Hub';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';

import AccountInfo from '../accountPicker/AccountInfo';
import AccountSwitcher from '../accountPicker/AccountSwitcher';
import ChainSwitcher from '../chainPicker/ChainSwitcher';
import Settings from './Settings';
import { Account, ChainInfo, Wallet } from '../../utils/types';

type Props = {
  account: Account;
  chain: ChainInfo;
  accounts: Array<Account>;
  wallets: Array<Wallet>;
  onChangeAccount: (account: Account) => void;
  onChangeChain: (chain: ChainInfo) => void;
  onClose: () => void;
};

enum TabName {
  account = 'account',
  network = 'network',
  settings = 'settings',
}

const StyledTabList = styled(TabList)(() => ({
  '& .MuiTab-root': {
    flexGrow: 1,
    textTransform: 'none',
    minHeight: 50,
  },
}));

const StyledTabPanel = styled(TabPanel)(({ theme }) => ({
  padding: theme.spacing(1, 0, 0, 0),
  margin: 0,
}));

export default function ComboPopup({
  account,
  chain,
  accounts,
  wallets,
  onChangeAccount,
  onChangeChain,
  onClose,
}: Props) {
  const [tab, setTab] = useState(TabName.network);

  const handleChangeTab = (event: SyntheticEvent, tab: string) => {
    setTab(tab as TabName);
  };

  const handleClose = () => {
    // Close modal
    onClose();

    // Reset to network tab on close for UX consistency
    setTab(TabName.network);
  };

  return (
    <Box>
      <AccountInfo account={account} chain={chain} sx={{ p: 2 }} />
      <Divider />
      <TabContext value={tab}>
        <StyledTabList onChange={handleChangeTab} aria-label="tabs">
          <Tab icon={<PeopleIcon />} iconPosition="start" label="Account" value={TabName.account} />
          <Tab icon={<HubIcon />} iconPosition="start" label="Network" value={TabName.network} />
          <Tab icon={<SettingsIcon />} iconPosition="start" label="Settings" value={TabName.settings} />
        </StyledTabList>
        <Divider />
        <StyledTabPanel value={TabName.account}>
          <AccountSwitcher
            account={account}
            accounts={accounts}
            wallets={wallets}
            chain={chain}
            onChange={onChangeAccount}
            onClose={handleClose}
          />
        </StyledTabPanel>
        <StyledTabPanel value={TabName.network}>
          <ChainSwitcher chain={chain} onChange={onChangeChain} onClose={handleClose} />
        </StyledTabPanel>
        <StyledTabPanel value={TabName.settings}>
          <Settings
            account={account}
            chain={chain}
            onChangeAccount={onChangeAccount}
            onChangeChain={onChangeChain}
            onClose={handleClose}
          />
        </StyledTabPanel>
      </TabContext>
    </Box>
  );
}
