import { createKeyMulti, encodeAddress, isAddress, sortAddresses } from '@polkadot/util-crypto';

import {
  Account,
  AccountType,
  ChainInfo,
  Policy,
  ProxyAction,
  ProxyActionType,
  Signatory,
  TransactionType,
  Vault,
} from './types';
import { getChainAddress, getDisplayName } from './helpers';
import _ from 'lodash';

export function initVault(chain: ChainInfo, account?: Account | null, empty?: boolean): Vault {
  return {
    name: account?.name ? `${getDisplayName(account?.name ?? '')}'s Vault` : '',
    chain: chain?.info ?? '',
    policies: [
      {
        name: '',
        type: TransactionType.any,
        signatories: [
          {
            name: empty || !account ? '' : account?.name ?? '',
            address: empty || !account ? '' : getChainAddress(account?.address ?? '', chain),
          },
        ],
        threshold: 1,
      },
    ],
  };
}

export function isValidPolicy(policy: Policy): boolean {
  return !!(
    policy?.type && // Type is set
    policy?.threshold > 0 && // Threshold is greater than zero
    policy?.signatories.length > 0 && // At least one signatory
    // All addresses are set and valid
    !policy?.signatories
      .map((signatory) => !!(signatory?.address && isAddress(signatory?.address ?? '')))
      .includes(false)
  );
}

export function policySetHasAtLeastOneAnyPolicy(policies: Array<Policy>): boolean {
  // All policies must be valid and must have at least one any policy
  return policies.filter((item) => item.type === TransactionType.any).length > 0;
}

export function generatePolicyDeduplicationId(policy: Policy): string {
  return [
    policy?.type,
    sortAddresses((policy?.signatories ?? []).map((signatory) => signatory?.address ?? '').filter(Boolean)).join(':'),
    policy?.threshold ?? '',
  ].join(':');
}

export function findDuplicateGroupsInPolicySetByIndex(policies: Array<Policy>): Array<Array<number>> {
  const duplicateGroups: Array<Array<number>> = [];
  let allDuplicates: Array<number> = [];
  for (const [idx, policy] of policies.entries()) {
    if (!allDuplicates.includes(idx)) {
      const policyId = generatePolicyDeduplicationId(policy);
      const duplicateIndices = policies
        .map((other, otherIdx) =>
          otherIdx !== idx && policyId === generatePolicyDeduplicationId(other) ? otherIdx : -1,
        )
        .filter((i) => i !== -1);
      if (duplicateIndices.length > 0) {
        const duplicateGroup = [idx, ...duplicateIndices];
        duplicateGroups.push(duplicateGroup);
        allDuplicates = allDuplicates.concat(duplicateGroup);
      }
    }
  }
  return duplicateGroups;
}

export function isValidPolicySet(policies: Array<Policy>): boolean {
  // All policies must be valid, have at least one "Any" policy and can't include any duplicates
  return (
    policySetHasAtLeastOneAnyPolicy(policies) &&
    !policies.map((item) => isValidPolicy(item)).includes(false) &&
    findDuplicateGroupsInPolicySetByIndex(policies).length === 0
  );
}

export function isValidCreationVault(vault: Vault): boolean {
  return isValidPolicySet(vault.policies);
}

export function isValidEditAndImportVault(vault: Vault): boolean {
  return isValidPolicySet(vault.policies) && isAddress(vault.address);
}

export function getChainSignatory(signatory: Signatory, chain: ChainInfo): Signatory {
  return {
    ...signatory,
    name: signatory?.name ?? '',
    address: signatory?.address ? getChainAddress(signatory?.address ?? '', chain) : '',
  };
}

export function getChainSignatories(signatories: Array<Signatory>, chain: ChainInfo): Array<Signatory> {
  return signatories.map((signatory) => getChainSignatory(signatory, chain));
}

export function getChainPolicy(policy: Policy, chain: ChainInfo): Policy {
  return {
    ...policy,
    name: policy?.name ?? '',
    type: policy?.type ?? TransactionType.any,
    signatories: getChainSignatories(policy?.signatories ?? [], chain),
    threshold: policy?.threshold ?? 1,
  };
}

export function getChainPolicies(policies: Array<Policy>, chain: ChainInfo): Array<Policy> {
  return (policies ?? []).map((policy) => getChainPolicy(policy, chain));
}

export function getChainVault(vault: Vault, chain: ChainInfo): Vault {
  return {
    ...vault,
    name: vault?.name,
    chain: chain?.info ?? '',
    policies: getChainPolicies(vault?.policies ?? [], chain),
  };
}

export function parseProxyActions(data: Vault, chain: ChainInfo): Array<ProxyAction> {
  let proxyActions: Array<ProxyAction> = [];
  for (const policy of data?.policies) {
    const signatoryAddresses = policy.signatories
      .map((signatory) => getChainAddress(signatory.address, chain))
      .filter((address) => isAddress(address));
    if (signatoryAddresses.length > 0) {
      if (signatoryAddresses.length === 1) {
        // standard account or pure proxy
        proxyActions.push({
          action: ProxyActionType.add,
          proxyType: policy.type,
          account: signatoryAddresses[0],
        });
      } else {
        // multisig
        const multisigAddress = encodeAddress(createKeyMulti(signatoryAddresses, policy.threshold), chain?.prefix);
        proxyActions.push({
          action: ProxyActionType.add,
          proxyType: policy.type,
          account: multisigAddress,
          accountType: AccountType.multisig,
        });
      }
    }
  }

  // Deduplicate by action, proxyType and account
  proxyActions = _.uniqBy(proxyActions, (item) => [item.action, item.proxyType, item.account].join(':'));

  return proxyActions;
}

export function makeProxyCreationActionsSignerAware(
  proxyActions: Array<ProxyAction>,
  account: Account,
): Array<ProxyAction> {
  let creationAwareProxyActions = [...proxyActions];

  const isSignerAnAnyProxy = creationAwareProxyActions.find(
    (item) =>
      item.account === account?.address &&
      item.action === ProxyActionType.add &&
      item.proxyType === TransactionType.any,
  );
  if (isSignerAnAnyProxy) {
    // If signer is assigned as an any proxy, they'll be added when the proxy is created, so we remove them from the list of actions
    creationAwareProxyActions = creationAwareProxyActions.filter(
      (item) =>
        item.account !== account?.address ||
        item.proxyType !== TransactionType.any ||
        item.action !== ProxyActionType.add,
    );
  } else {
    // If signer is not assigned as an any proxy, they need to be removed after proxy creation, so we add a remove action
    creationAwareProxyActions.push({
      action: ProxyActionType.remove,
      proxyType: TransactionType.any,
      account: account?.address ?? '',
    });
  }

  return creationAwareProxyActions;
}

export function makeProxyUpdateActionsStateAware(
  proxyActions: Array<ProxyAction>,
  state: Vault,
  chain: ChainInfo,
): Array<ProxyAction> {
  let stateAwareProxyActions = [...proxyActions];
  const currentStateActions = parseProxyActions(state, chain);

  const actionsToRemove: Array<ProxyAction> = [],
    actionsToInsert: Array<ProxyAction> = [];

  // Find "add" actions in current state that aren't in new actions and add remove actions for them and then remove add actions that are in both since they already exist
  for (const action of currentStateActions) {
    if (action.action === ProxyActionType.add) {
      // We only care about matching additions
      const isInNewState = proxyActions.find(
        (item) =>
          item.action === action.action && item.proxyType === action.proxyType && item.account === action.account,
      );
      if (isInNewState) {
        // add to list of actions to remove since it was already added
        actionsToRemove.push(action);
      } else {
        // add a remove action since it has been removed
        actionsToInsert.push({
          ...action,
          action: ProxyActionType.remove,
        });
      }
    }
  }

  // Remove everything in actionsToRemove
  stateAwareProxyActions = stateAwareProxyActions.filter((action) => {
    const isinActionsToRemove = actionsToRemove.find(
      (item) => item.action === action.action && item.proxyType === action.proxyType && item.account === action.account,
    );
    return !isinActionsToRemove;
  });

  // Insert everything in actionsToInsert
  stateAwareProxyActions = stateAwareProxyActions.concat(actionsToInsert);

  return stateAwareProxyActions;
}

export function getVaultPathUrl(vault: Vault, path = '/settings'): string {
  return `/${vault.chain}:${vault.address}${path ? path : '/settings'}`;
}
