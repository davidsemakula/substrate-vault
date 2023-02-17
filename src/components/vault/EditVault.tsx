import React, { useEffect, useMemo, useState } from 'react';

import Steps, { StepInput } from '../core/Steps';
import SetName from './core/SetName';
import SetPolicies from './core/SetPolicies';
import Summary from './core/Summary';
import Status, { StatusOption } from './core/Status';
import { Account, ChainInfo, ProxyAction, ProxyActionType, TransactionType, Vault } from '../../utils/types';
import {
  getChainVault,
  isValidEditAndImportVault,
  makeProxyUpdateActionsStateAware,
  parseProxyActions,
} from '../../utils/vault';
import useChain from '../../hooks/useChain';
import useAccount from '../../hooks/useAccount';
import useAccounts from '../../hooks/useAccounts';
import useApi from '../../hooks/useApi';
import useSigner from '../../hooks/useSigner';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { submitExtrinsic } from '../../services/api';
import { Signer } from '@polkadot/api/types';
import { ApiPromise } from '@polkadot/api';
import { UserContextType } from '../../context/types';
import { useNavigate } from 'react-router-dom';
import useVault from '../../hooks/useVault';
import storage from '../../services/storage';
import { getChainByName } from '../../utils/helpers';
import useSetUserContext from '../../hooks/useSetUserContext';

const VaultSteps = Steps<Vault, UserContextType>;

const FORM_STEPS: Array<StepInput> = [
  { title: 'Name your vault', content: SetName },
  { title: 'Approval policies', content: SetPolicies },
  { title: 'Review and confirm', content: Summary, props: { title: "You're about to edit your Vault" } },
];

export default function EditVault() {
  const chain = useChain();
  const account = useAccount();
  const vault = useVault();
  const accounts = useAccounts();
  const { api, apiSupported } = useApi();
  const signer = useSigner();
  const navigate = useNavigate();
  const { setChain } = useSetUserContext();

  const [data, setData] = useState<Vault | null | undefined>(vault);
  const [status, setStatus] = useState<StatusOption>(StatusOption.initiating);
  const [canRetry, setCanRetry] = useState<boolean>(false);

  useMemo(() => {
    const vaultChain = vault?.chain && getChainByName(vault.chain);
    if (vaultChain && vaultChain?.info !== chain.info) {
      setChain(vaultChain);
    }
  }, [vault, chain]);

  const cleanedVault = useMemo(() => {
    // Step components don't take care of network changes, so we do it here
    if (data && chain?.info && data?.chain !== chain?.info) {
      return getChainVault(data, chain);
    }
    return data;
  }, [data, chain]);

  const contextProps: UserContextType = useMemo(() => {
    return {
      chain,
      account,
      accounts,
    };
  }, [account, chain, accounts]);

  useEffect(() => {
    // Update canRetry based on status
    setCanRetry(status === StatusOption.canceled || status === StatusOption.failed);
  }, [status]);

  const successContent = useMemo(() => {
    return <Status status={status} />;
  }, [status]);

  const onStepChange = (step: number) => {
    const isOnSubmissionStep = step >= FORM_STEPS.length;
    if (isOnSubmissionStep && data) {
      // All steps have been completed, we can create the vault
      updateVault(data);
    }
  };

  const onDataChange = (step: number, data?: Vault | null) => {
    setData(data);
  };

  const createApprovalPolicy = (
    api: ApiPromise,
    pureProxyAddress: string,
    proxyActions: Array<ProxyAction>,
    chain: ChainInfo,
    account: Account,
    signer: Signer,
    data: Vault,
  ): void => {
    if (proxyActions.length > 0) {
      setStatus(StatusOption.initiating);

      // Callbacks for creating approval policy
      const onBatchAllBroadCast = () => {
        setStatus(StatusOption.processing);
      };

      const onBatchAllError = () => {
        setStatus(StatusOption.failed);
      };

      const onBatchAllSuccess = () => {
        storage.saveVault(data);

        setStatus(StatusOption.updated);
        setTimeout(() => {
          // Navigate to vault settings
          navigate(`/${chain?.info}:${pureProxyAddress}/settings`);
        }, 4000);
      };

      const proxyCalls = [];
      for (const proxyAction of proxyActions) {
        if (proxyAction.action === ProxyActionType.add) {
          api.tx.proxy.addProxy(proxyAction.account, proxyAction.proxyType, 0);
        }
        proxyCalls.push(
          api.tx.proxy.proxy(
            pureProxyAddress, // Dispatch call as pure proxy
            TransactionType.any, // can be null, this forces an Any proxy to be the caller
            proxyAction.action === ProxyActionType.remove
              ? api.tx.proxy.removeProxy(proxyAction.account, proxyAction.proxyType, 0) // Remove proxy call
              : api.tx.proxy.addProxy(proxyAction.account, proxyAction.proxyType, 0), // Add proxy call
          ),
        );
      }

      if (proxyCalls.length > 0) {
        // Extrinsic for creating pure proxy
        const batchAllTx: SubmittableExtrinsic = api.tx.utility.batchAll(proxyCalls);
        submitExtrinsic(batchAllTx, account?.address ?? '', signer, {
          onBroadcast: onBatchAllBroadCast,
          onSuccess: onBatchAllSuccess,
          onError: onBatchAllError,
        });
      } else {
        setStatus(StatusOption.failed);
      }
    } else {
      // Assume success is there are no actions to perform
      setStatus(StatusOption.completed);
    }
  };

  const updateVault = (data: Vault) => {
    setStatus(StatusOption.initiating);

    if (
      isValidEditAndImportVault(data) &&
      vault?.address &&
      chain &&
      account?.address &&
      api &&
      apiSupported &&
      signer
    ) {
      const isSignerPartOfAnAnyPolicy =
        vault.policies.filter(
          (policy) =>
            policy.type === TransactionType.any &&
            policy.signatories
              .map((signatory) => signatory?.address)
              .filter(Boolean)
              .includes(account.address),
        ).length > 0;
      if (isSignerPartOfAnAnyPolicy) {
        let proxyActions: Array<ProxyAction> = parseProxyActions(data, chain);
        proxyActions = makeProxyUpdateActionsStateAware(proxyActions, vault, chain);

        if (proxyActions.length > 0) {
          createApprovalPolicy(api, vault.address, proxyActions, chain, account, signer, data);
        } else {
          setStatus(StatusOption.updated);
          setTimeout(() => {
            // Navigate to vault settings
            navigate(`/${chain?.info}:${vault.address}/settings`);
          }, 4000);
        }
      } else {
        setStatus(StatusOption.denied);
      }
    } else {
      setStatus(StatusOption.failed);
    }
  };

  return (
    <VaultSteps
      title="Edit Vault"
      steps={FORM_STEPS}
      data={cleanedVault}
      props={contextProps}
      successContent={successContent}
      successBtn="Update"
      canRetry={canRetry}
      onStepChange={onStepChange}
      onDataChange={onDataChange}
    />
  );
}
