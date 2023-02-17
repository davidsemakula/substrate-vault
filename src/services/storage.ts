import { Vault } from '../utils/types';
import { STORAGE_KEYS } from '../utils/constants';

type StoreType = {
  getItem: (key: string) => string | null | undefined;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

const VAULTS_KEY = `${STORAGE_KEYS.namespace}_vaults`;

export function getVaultKey(id: string): string {
  return `${STORAGE_KEYS.namespace}_vault_${id}`;
}

export function getVaultId(vault: Vault, separator = '_'): string {
  return `${vault.chain}${separator}${vault.address}`;
}

// A convenience wrapper around web storage that preserves the type of the value
// https://developer.mozilla.org/en-US/docs/Web/API/Storage
export class Storage {
  store: StoreType | undefined = localStorage;

  constructor(store: StoreType = localStorage) {
    this.store = store;
  }

  _isStoreDefined(): boolean {
    return typeof this.store !== 'undefined';
  }

  set<T>(key: string, value: T): void {
    if (this._isStoreDefined()) {
      this.store?.setItem(key, JSON.stringify(value));
    }
  }

  get<T>(key: string): T | null | undefined {
    if (this._isStoreDefined()) {
      const value = this.store?.getItem(key);
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value as T;
        }
      }
      return null;
    }
  }

  remove(key: string): void {
    if (this._isStoreDefined()) {
      this.store?.removeItem(key);
    }
  }

  clear(): void {
    if (this._isStoreDefined()) {
      this.store?.clear();
    }
  }

  getVaultIds(): Array<string> {
    return this.get<Array<string>>(VAULTS_KEY) ?? [];
  }

  getVault(id: string): Vault | null | undefined {
    return this.get<Vault>(getVaultKey(id));
  }

  getVaults(): Array<Vault> {
    const vaultIds = this.getVaultIds();
    return vaultIds.map((id) => this.getVault(id)).filter(Boolean) as Array<Vault>;
  }

  saveVault(vault: Vault): void {
    if (vault.address && vault.chain) {
      const vaults = this.getVaultIds();
      const id = getVaultId(vault);
      if (!vaults.includes(id)) {
        let newVaults = [...vaults];
        newVaults = [id].concat(newVaults);
        this.set<Array<string>>(VAULTS_KEY, newVaults);
      }

      this.set(getVaultKey(id), vault);
    }
  }
}

const storage = new Storage();

export default storage;
