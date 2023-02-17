import { Vault } from '../utils/types';
import storage from '../services/storage';

export default function useLocalVaults(): Array<Vault> {
  return storage.getVaults();
}
