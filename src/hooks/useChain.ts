import { useContext } from 'react';

import AppContext from '../context/AppContext';
import { ChainInfo } from '../utils/types';

export default function useChain(): ChainInfo {
  const { chain } = useContext(AppContext);
  return chain;
}
