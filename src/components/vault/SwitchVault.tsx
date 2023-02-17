import React from 'react';
import { Outlet } from 'react-router-dom';

import useUrlVault from '../../hooks/useUrlVault';

export default function SwitchVault() {
  // All this component does is switch to the chain and vault in the url
  useUrlVault();

  return <Outlet />;
}
