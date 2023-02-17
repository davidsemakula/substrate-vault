import React, { useEffect, useMemo, useState } from 'react';
import { encodeAddress } from '@polkadot/util-crypto';

import Steps, { StepInput } from '../core/Steps';
import SetName from './core/SetName';
import SetPolicies from './core/SetPolicies';
import Summary from './core/Summary';
import Status, { StatusOption, StatusStepInput } from './core/Status';
import {
  Account,
  ChainInfo,
  ISubmittableResultWithBlockNumber,
  ProxyAction,
  ProxyActionType,
  TransactionType,
  Vault,
} from '../../utils/types';
import {
  getChainVault,
  initVault,
  isValidCreationVault,
  makeProxyCreationActionsSignerAware,
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
import storage from '../../services/storage';
import { UserContextType } from '../../context/types';
import { useNavigate } from 'react-router-dom';
import useUnsetVault from '../../hooks/useUnsetVault';

const VaultSteps = Steps<Vault, UserContextType>;

const FORM_STEPS: Array<StepInput> = [
  { title: 'Name your vault', content: SetName },
  { title: 'Approval policies', content: SetPolicies },
  { title: 'Review and confirm', content: Summary, props: { title: "You're about to create a new vault" } },
];

const STATUS_STEPS: Array<StatusStepInput> = [
  {
    title: 'Create Vault',
  },
  {
    title: 'Configure approval policies',
  },
];

export default function CreateVault() {
  const chain = useChain();
  const account = useAccount();
  const accounts = useAccounts();
  const { api, apiSupported } = useApi();
  const signer = useSigner();
  const navigate = useNavigate();
  useUnsetVault();

  const [data, setData] = useState<Vault | null | undefined>(initVault(chain, account));
  const [status, setStatus] = useState<StatusOption>(StatusOption.initiating);
  const [transactionSteps, setTransactionSteps] = useState<Array<StatusStepInput>>([]);
  const [activeTransactionStep, setActiveTransactionStep] = useState<number>(0);
  const [canRetry, setCanRetry] = useState<boolean>(false);

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
    return <Status status={status} steps={transactionSteps} activeStep={activeTransactionStep} />;
  }, [status, transactionSteps, activeTransactionStep]);

  const onStepChange = (step: number) => {
    const isOnSubmissionStep = step >= FORM_STEPS.length;
    if (isOnSubmissionStep && data) {
      // All steps have been completed, we can create the vault
      createVault(data);
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
  ): void => {
    if (proxyActions.length > 0) {
      setActiveTransactionStep(1);
      setStatus(StatusOption.initiating);
      setTransactionSteps(STATUS_STEPS);

      ///*
      // Callbacks for creating approval policy
      const onBatchAllBroadCast = () => {
        setStatus(StatusOption.processing);
      };

      const onBatchAllError = () => {
        setStatus(StatusOption.failed);
      };

      const onBatchAllSuccess = (result: ISubmittableResultWithBlockNumber) => {
        const blockNumber = result.blockNumber?.toHex(),
          blockHash = result.status.value.toHex();
        console.log('onBatchAllSuccess:blockNumber:', blockNumber);
        console.log('onBatchAllSuccess:blockHash:', blockHash);

        setStatus(StatusOption.completed);
        setActiveTransactionStep(2);
        setTimeout(() => {
          // Navigate to vault settings
          navigate(`/${chain?.info}:${pureProxyAddress}/settings`);
        }, 500);
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

  const createVault = (data: Vault) => {
    setStatus(StatusOption.initiating);
    setTransactionSteps([]);
    setActiveTransactionStep(0);

    if (isValidCreationVault(data) && chain && account?.address && api && apiSupported && signer) {
      console.log('createVault:', JSON.stringify(data, null, 4));

      let proxyActions: Array<ProxyAction> = parseProxyActions(data, chain);
      console.log('proxyActions:original:', JSON.stringify(proxyActions, null, 4), account?.address);

      proxyActions = makeProxyCreationActionsSignerAware(proxyActions, account);
      console.log('proxyActions:cleaned:', JSON.stringify(proxyActions, null, 4), account?.address);

      const requiresTwoTransactions = proxyActions.length > 0;
      if (requiresTwoTransactions) {
        // User has to sign 2 transactions, update Status UI to indicate this
        setTransactionSteps(STATUS_STEPS);
      }

      // Callbacks for creating pure proxy
      const onPureProxyBroadCast = () => {
        setStatus(StatusOption.processing);
      };

      const onPureProxyError = () => {
        setStatus(StatusOption.failed);
      };

      const onPureProxySuccess = (result: ISubmittableResultWithBlockNumber) => {
        const blockNumber = result.blockNumber?.toHex(),
          blockHash = result.status.value.toHex();
        console.log('onPureProxySuccess:blockNumber:', blockNumber);
        console.log('onPureProxySuccess:blockHash:', blockHash);

        const pureProxyRecord = result.findRecord('proxy', 'PureCreated');
        console.log('onPureProxySuccess:pureProxyRecord', pureProxyRecord);

        if (pureProxyRecord) {
          const pureProxyAddress = encodeAddress(pureProxyRecord.event.data[0].toHex(), chain?.prefix);
          console.log('onPureProxySuccess:pureProxyAddress', pureProxyAddress);

          if (requiresTwoTransactions) {
            // Initiate approval policy creation
            createApprovalPolicy(api, pureProxyAddress, proxyActions, chain, account, signer);
          } else {
            setStatus(StatusOption.completed);
          }

          const newVault: Vault = {
            ...data,
            address: pureProxyAddress,
            chain: (chain?.info || data?.chain) ?? '',
            meta: {
              blockNumber: blockNumber ?? '',
              blockHash: blockHash ?? '',
            },
          };

          storage.saveVault(newVault);
        } else {
          setStatus(StatusOption.failed);
        }
      };

      // Extrinsic for creating pure proxy
      const pureProxyTx: SubmittableExtrinsic = api.tx.proxy.createPure(TransactionType.any, 0, 0);
      submitExtrinsic(pureProxyTx, account?.address ?? '', signer, {
        onBroadcast: onPureProxyBroadCast,
        onSuccess: onPureProxySuccess,
        onError: onPureProxyError,
      });
    } else {
      setStatus(StatusOption.failed);
    }
  };

  return (
    <VaultSteps
      title="Create new Vault"
      steps={FORM_STEPS}
      data={cleanedVault}
      props={contextProps}
      successContent={successContent}
      successBtn="Create"
      canRetry={canRetry}
      onStepChange={onStepChange}
      onDataChange={onDataChange}
    />
  );
}
