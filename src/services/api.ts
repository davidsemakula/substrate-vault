import { ApiPromise, WsProvider } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import { ChainInfo, ISubmittableResultWithBlockNumber, ProviderInfo } from '../utils/types';
import { Signer } from '@polkadot/api/types';

export function getRandomProvider(chain: ChainInfo, includeLightClient = false): ProviderInfo {
  let name = '',
    providerNames = Object.keys(chain.providers);
  if (!includeLightClient) {
    providerNames = providerNames.filter((key) => !/^light\s*client/i.test(key));
  }
  if (providerNames.length > 0) {
    const randomIdx = Math.floor(Math.random() * providerNames.length);
    name = providerNames[randomIdx];
  }
  return {
    name,
    url: name ? chain.providers[name] : '',
  };
}
export async function createApi(endpoint: string): Promise<ApiPromise> {
  return ApiPromise.create({ provider: new WsProvider(endpoint) });
}

type ExtrinsicStatusCallbacks = {
  onBroadcast?: (result: ISubmittableResultWithBlockNumber) => void;
  onSuccess: (result: ISubmittableResultWithBlockNumber) => void;
  onFinalized?: (result: ISubmittableResultWithBlockNumber) => void;
  onError: (error: Error | null, result?: ISubmittableResultWithBlockNumber | null) => void;
};

export function submitExtrinsic(
  extrinsic: SubmittableExtrinsic,
  account: string,
  signer: Signer,
  { onBroadcast, onSuccess, onFinalized, onError }: ExtrinsicStatusCallbacks,
): void {
  extrinsic
    .signAndSend(account, { signer }, (result: ISubmittableResultWithBlockNumber) => {
      console.log('signAndSend:result:toHuman', result, result.toHuman(true));

      if (result.isError) {
        onError(null, result);
      } else if (result.status.isBroadcast) {
        onBroadcast && onBroadcast(result);
      } else if (result.isInBlock) {
        if (result.findRecord('system', 'ExtrinsicFailed')) {
          onError(null, result);
        } else if (result.findRecord('system', 'ExtrinsicSuccess')) {
          onSuccess(result);
        }
      } else if (result.isFinalized) {
        onFinalized && onFinalized(result);
      }
    })
    .catch((e) => {
      console.error('submitExtrinsic:error:', e);
      onError(e);
    });
}
