import _ from 'lodash';
import { encodeAddress } from '@polkadot/util-crypto';
import Color from 'color';

import { Account, ChainInfo } from './types';
import { allChains } from './chains';

export function getChainByName(name: string): ChainInfo | undefined {
  return allChains.find((chain) => chain?.info === name);
}

export function getChainAddress(address: string, chain?: ChainInfo | null): string {
  // TODO: EVM address conversion
  return address ? encodeAddress(address, chain?.prefix) : address;
}

export function getChainAccount(account: Account, chain: ChainInfo): Account {
  return {
    ...account,
    address: getChainAddress(account?.address ?? '', chain),
  };
}

export function truncateAddress(address: string, maxLength = 10): string {
  const prefixLength = Math.ceil(maxLength * 0.6),
    suffixLength = maxLength - prefixLength;
  return address.length > maxLength
    ? [address.slice(0, prefixLength), address.slice(-suffixLength)].join('...')
    : address;
}

export function getDisplayName(name: string) {
  return _.startCase(name);
}

export function generateId(tokens: Array<string | null | undefined>): string {
  return tokens
    .filter(Boolean)
    .join(':')
    .replaceAll(/[^\w:]/gi, '');
}

export function mixColors(colors: Array<string>): string {
  if (colors.length > 0) {
    let mixedColor = Color(colors[0]);
    let idx = 1;
    while (idx < colors.length) {
      mixedColor = mixedColor.mix(Color(colors[idx]));
      idx++;
    }
    return mixedColor.hex();
  }
  return '';
}

export function parseHexColor(color: string, defaultColor?: string): string {
  try {
    return Color(color).hex();
  } catch (e) {
    for (const regex of [
      /(#([0-9A-F]{3,4}){1,2})\b/gi, // Extract hex(a) format
      /rgb\((\s*\d{1,3}\s*,){2}\s*\d{1,3}\s*\)/gi, // Extract rgb format
      /rgba\((\s*\d{1,3}\s*,){3}\s*\d(?:\.\d+)?\s*\)/gi, // Extract rgba format
      /(white|black|grey|lightgrey|red|blue|green|cyan|magenta|yellow|orange|brown|pink|purple|violet|indigo)/gi, // Extract a few core colors
    ]) {
      const matches = (color.match(regex) ?? []).filter(Boolean);
      if (matches.length > 1) {
        // Mix colors if more than one is extracted
        return mixColors(matches);
      } else if (matches.length > 0) {
        return parseHexColor(matches[0]);
      }
    }
    return defaultColor ?? '#ffffff'; // default to white if non is specified
  }
}
