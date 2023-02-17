import { useEffect } from 'react';

import useSetUserContext from './useSetUserContext';
import useVault from './useVault';
import { useParams } from 'react-router-dom';
import storage, { getVaultId } from '../services/storage';

export default function useUrlVault(): void {
  const vault = useVault();
  const { setVault } = useSetUserContext();

  const { vaultId } = useParams();
  const vaultKey = (vaultId ?? '').split(':').join('_');
  const urlVault = storage.getVault(vaultKey);

  useEffect(() => {
    if (urlVault && (!vault || getVaultId(vault) !== getVaultId(urlVault))) {
      setVault(urlVault);
    }
  }, []);
}
