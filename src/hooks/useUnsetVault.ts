import { useEffect } from 'react';

import useSetUserContext from './useSetUserContext';

export default function useUnsetVault(): void {
  const { setVault } = useSetUserContext();
  useEffect(() => {
    setVault(null);
  }, []);
}
