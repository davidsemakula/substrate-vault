import { useContext } from 'react';

import AppContext from '../context/AppContext';
import { Account } from '../utils/types';
import { getChainAccount } from '../utils/helpers';
import useChain from './useChain';

export default function useAccounts(): Array<Account> {
  const { accounts } = useContext(AppContext);
  const chain = useChain();
  return (accounts ?? [])
    .map((account) => (account && account?.address && chain ? getChainAccount(account, chain) : account))
    .filter(Boolean);
}
