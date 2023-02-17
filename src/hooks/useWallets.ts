import { useContext } from 'react';

import AppContext from '../context/AppContext';
import { Wallet } from '../utils/types';

export default function useWallets(): Array<Wallet> {
  const { wallets } = useContext(AppContext);
  return wallets;
}
