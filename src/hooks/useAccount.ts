import { useContext } from 'react';

import AppContext from '../context/AppContext';
import { Account } from '../utils/types';
import { getChainAccount } from '../utils/helpers';
import useChain from './useChain';

export default function useAccount(): Account | null | undefined {
  const { account } = useContext(AppContext);
  const chain = useChain();
  return account && account?.address && chain ? getChainAccount(account, chain) : account;
}
