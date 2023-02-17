import React from 'react';
import { createHashRouter, Navigate } from 'react-router-dom';

import App from './components/App';
import Home from './components/home';
import CreateVault from './components/vault/CreateVault';
import ComingSoon from './components/status/ComingSoon';
import SwitchVault from './components/vault/SwitchVault';
import VaultSettings from './components/vault/VaultSettings';
import ImportVault from './components/vault/ImportVault';
import EditVault from './components/vault/EditVault';

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Navigate to="/" replace={true} />, // Redirect home on error
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'new-vault/create',
        element: <CreateVault />,
      },
      {
        path: 'new-vault/import',
        element: <ImportVault />,
      },
      {
        path: ':vaultId/',
        element: <SwitchVault />,
        children: [
          {
            path: 'edit',
            element: <EditVault />,
          },
          {
            path: 'assets',
            element: <ComingSoon />,
          },
          {
            path: 'transactions',
            element: <ComingSoon />,
          },
          {
            path: 'address-book',
            element: <ComingSoon />,
          },
          {
            path: 'settings',
            element: <VaultSettings />,
          },
        ],
      },
    ],
  },
]);
