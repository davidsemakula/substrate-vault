import { useContext } from 'react';

import AppContext from '../context/AppContext';
import { UserContextActionsType } from '../context/types';

export default function useSetUserContext(): UserContextActionsType {
  const { setChain, setAccount, setVault } = useContext(AppContext);
  return { setChain, setAccount, setVault };
}
