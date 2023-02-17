import { useContext } from 'react';

import AppContext from '../context/AppContext';
import { ApiContextType } from '../context/types';

export default function useApi(): ApiContextType {
  const { api, apiSupported } = useContext(AppContext);
  return { api, apiSupported };
}
