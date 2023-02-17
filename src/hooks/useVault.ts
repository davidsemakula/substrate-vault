import { useContext } from 'react';

import AppContext from '../context/AppContext';
import { Vault } from '../utils/types';

export default function useVault(): Vault | null | undefined {
  const { vault } = useContext(AppContext);
  return vault;
}
