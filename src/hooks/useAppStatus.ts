import { useContext } from 'react';

import AppContext from '../context/AppContext';
import { AppContextActionsType, AppContextTypes } from '../context/types';

interface AppStatusType extends AppContextTypes, AppContextActionsType {}
export default function useAppStatus(): AppStatusType {
  const { loading, drawerOpen, setLoading, toggleColorMode, toggleDrawer } = useContext(AppContext);
  return { loading, drawerOpen, setLoading, toggleColorMode, toggleDrawer };
}
