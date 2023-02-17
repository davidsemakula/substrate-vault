import React, { useEffect, useMemo, useState } from 'react';
import { web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import AppContext from '../context/AppContext';
import Header from './Header';
import MainContent from './MainContent';
import { Account, ChainInfo, ColorMode, Vault, Wallet } from '../utils/types';
import { generateId } from '../utils/helpers';
import { defaultChain } from '../utils/chains';
import { createApi, getRandomProvider } from '../services/api';
import { APP_NAME, STORAGE_KEYS } from '../utils/constants';
import storage from '../services/storage';
import { ApiPromise } from '@polkadot/api';
import { Signer } from '@polkadot/api/types';
import { createCustomTheme } from '../theme';

export default function App(): React.ReactElement {
  // Determine preferred theme
  const systemColorMode = useMediaQuery('(prefers-color-scheme: dark)') ? ColorMode.dark : ColorMode.light;
  const cachedColorMode = storage.get<string>(STORAGE_KEYS.theme);
  const preferredColorMode = (cachedColorMode ?? systemColorMode) as ColorMode;

  // State variables
  const [loading, setLoading] = useState<boolean>(false);
  const [colorMode, setColorMode] = useState<ColorMode>(preferredColorMode);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chain, setChain] = useState<ChainInfo>(defaultChain);
  const [account, setAccount] = useState<Account>();
  const [vault, setVault] = useState<Vault | null | undefined>();
  const [accounts, setAccounts] = useState<Array<Account>>([]);
  const [signer, setSigner] = useState<Signer | null | undefined>();
  const [wallets, setWallets] = useState<Array<Wallet>>([]);
  const [api, setApi] = useState<ApiPromise | null | undefined>();
  const [apiSupported, setApiSupported] = useState<boolean | undefined>();

  // Set theme
  useEffect(() => {
    if (colorMode !== preferredColorMode) {
      setColorMode(preferredColorMode);
    }
  }, [preferredColorMode, colorMode]);

  const theme = useMemo(() => {
    return createCustomTheme(colorMode === ColorMode.dark);
  }, [colorMode]);

  const toggleColorMode = () => {
    setColorMode((prevMode) => {
      const newMode = prevMode === ColorMode.light ? ColorMode.dark : ColorMode.light;
      storage.set<string>(STORAGE_KEYS.theme, newMode);
      return newMode;
    });
  };

  // Handle drawer
  const toggleDrawer = () => {
    setDrawerOpen((prevState) => !prevState);
  };

  // Set chain and api
  const setDynamicChainAndApiInfo = (chain: ChainInfo) => {
    async function performEnrichment() {
      let provider = chain?.provider;
      if (!provider) {
        // Show user that something is happening
        setLoading(true);

        // Set a random provider if none is set
        provider = getRandomProvider(chain);
        const api = await createApi(provider.url).catch((e) => {
          console.error('Failed to create API:', e);
        });

        setApi(api ? api : undefined); // TypeScript chokes on shorthand

        let prefix = chain?.prefix,
          isValidated = !!chain?.isValidated;

        const decimals = chain?.decimals ?? [],
          symbols = chain?.symbols ?? [];

        if (api && !isValidated) {
          // validated chain properties if they haven't yet been validated
          const chainInfo = await api.registry.getChainProperties();
          if (chainInfo) {
            const chainInfoJSON = JSON.parse(JSON.stringify(chainInfo));
            if (typeof chainInfoJSON?.ss58Format === 'number') {
              prefix = chainInfoJSON.ss58Format;
              isValidated = true;
            }

            if (
              Array.isArray(chainInfoJSON?.tokenSymbol) &&
              chainInfoJSON.tokenSymbol.length > 0 &&
              Array.isArray(chainInfoJSON?.tokenDecimals) &&
              chainInfoJSON.tokenSymbol.length
            ) {
              // Merge new symbols and decimals into existing arrays
              for (const [idx, newSymbol] of chainInfoJSON?.tokenSymbol.entries()) {
                const newDecimal = chainInfoJSON?.tokenDecimals[idx];
                if (!symbols?.includes(newSymbol) && typeof newDecimal === 'number') {
                  symbols.push(newSymbol);
                  decimals.push(newDecimal);
                }
              }
            }
          }
        }

        // Only update state if at least the provider needed to be set
        setChain({
          ...chain,
          prefix,
          decimals,
          symbols,
          provider,
          isValidated,
        });
        setLoading(false);
      }
    }

    performEnrichment();
  };

  useEffect(() => {
    // Do some chain info enrichment everytime a new chain is set, `provider` && `isValidated` are used to prevent infinite loops
    setDynamicChainAndApiInfo(chain);
  }, [chain]);

  useEffect(() => {
    if (api) {
      setApiSupported(!!(api.tx.proxy && api.tx.multisig && api.tx.utility));
    }
  }, [api]);

  const onChangeChain = (chain: ChainInfo) => {
    setChain(chain);
    if (!chain.provider) {
      // New chain, reset Api state
      setApi(null);
      setApiSupported(undefined);
    }
  };

  // Get wallets and accounts
  useEffect(() => {
    let unsubscribe: () => void;
    // returns an array of all the injected sources
    // (this needs to be called first, before other requests)
    web3Enable(APP_NAME).then((injectedExtensions) => {
      setWallets(injectedExtensions as Array<Wallet>);

      // returns an array of { address, meta: { name, source } }
      // meta.source contains the name of the extension that provides this account
      web3AccountsSubscribe((injectedAccounts) => {
        if (injectedAccounts?.length) {
          const cleanedAccounts: Array<Account> = injectedAccounts.map((account) => ({
            id: generateId([account?.meta?.source ?? '', account?.address ?? '']),
            address: account.address ?? '',
            name: account?.meta?.name ?? '',
            genesisHash: account?.meta?.genesisHash ?? '',
            source: account?.meta?.source ?? '',
            type: account?.type ?? '',
          }));

          setAccounts(cleanedAccounts);
          setAccount(cleanedAccounts[0]);
        }
      }).then((unsub) => {
        unsubscribe = unsub;
      });
    });

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  useEffect(() => {
    setSigner(account?.source ? (wallets ?? []).find((wallet) => wallet?.name === account?.source)?.signer : null);
  }, [account, wallets]);

  return (
    <AppContext.Provider
      value={{
        // Data and Status
        loading,
        drawerOpen,
        chain,
        account,
        vault,
        accounts,
        signer,
        wallets,
        api,
        apiSupported,

        // Actions
        setLoading,
        toggleColorMode,
        toggleDrawer,
        setChain: onChangeChain,
        setAccount,
        setVault,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Stack justifyContent="top" alignItems="none" minHeight="100%">
          <Box flexGrow={0}>
            <Header />
          </Box>
          {loading ? (
            <Box flexGrow={0}>
              <LinearProgress />
            </Box>
          ) : null}
          <Stack flexGrow={1} justifyContent="top" alignItems="none">
            <MainContent />
          </Stack>
        </Stack>
      </ThemeProvider>
    </AppContext.Provider>
  );
}
