import { useContext } from 'react';
import { Signer } from '@polkadot/api/types';

import AppContext from '../context/AppContext';

export default function useSigner(): Signer | null | undefined {
  const { signer } = useContext(AppContext);
  return signer;
}
