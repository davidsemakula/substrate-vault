import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { StepProps } from '../../core/Steps';
import ManagePolicy from './ManagePolicy';
import { Policy, TransactionType, Vault } from '../../../utils/types';
import { getChainAddress, getChainByName, getDisplayName } from '../../../utils/helpers';
import {
  findDuplicateGroupsInPolicySetByIndex,
  generatePolicyDeduplicationId,
  isValidPolicySet,
  policySetHasAtLeastOneAnyPolicy,
} from '../../../utils/vault';
import { UserContextType } from '../../../context/types';

interface Props extends StepProps<Vault>, UserContextType {}

export default function SetPolicies({ data, chain, account, accounts, onChange }: Props) {
  const [policies, setPolicies] = useState<Array<Policy>>(data?.policies ?? []);
  const [expanded, setExpanded] = useState<number>(0);
  const [error, setError] = useState<string | undefined>();

  const handleExpandToggle = (idx: number) => () => {
    setExpanded((prevExpanded) => (prevExpanded === idx ? -1 : idx));
  };

  const addOrUpdatePolicy = (policy: Policy, idx?: number) => {
    const newPolicies = [...policies];
    if (typeof idx === 'number') {
      newPolicies[idx] = policy;
    } else {
      newPolicies.push(policy);
    }
    setPolicies(newPolicies);
  };

  const removePolicy = (idx: number) => {
    let newPolicies = [...policies];
    if (idx < newPolicies.length) {
      newPolicies = [...newPolicies.slice(0, idx), ...newPolicies.slice(idx + 1)];
    }

    setPolicies(newPolicies);
    if (expanded === idx) {
      setExpanded(idx > 1 ? idx - 1 : 0);
    }
  };

  const handleAddPolicy = () => {
    // Add an empty signatory
    addOrUpdatePolicy({
      type: TransactionType.any,
      signatories: [
        { name: account?.name, address: getChainAddress(account?.address ?? '', getChainByName(data?.chain ?? '')) },
      ],
      threshold: 1,
    });
    if (policies?.length) {
      setExpanded(policies.length);
    }
  };

  const handlePolicyChange = (idx: number) => (data: Policy) => addOrUpdatePolicy(data, idx);

  useEffect(() => {
    onChange(isValidPolicySet(policies), {
      ...data,
      policies,
    });

    let newError = '';
    if (!policySetHasAtLeastOneAnyPolicy(policies)) {
      newError = 'There must be at least one policy with "Transaction Type" set to "Any".';
    } else {
      const duplicateSets = findDuplicateGroupsInPolicySetByIndex(policies);
      if (duplicateSets.length > 0) {
        const duplicateDisplayNames = duplicateSets[0].map(
          (idx) => `"${policies[idx]?.name ? policies[idx]?.name : `Policy #${idx + 1}`}"`,
        );
        newError = `Duplicate policies: ${duplicateDisplayNames
          .slice(0, -1)
          .join(', ')} and ${duplicateDisplayNames.slice(
          -1,
        )} provide the same permissions to the same set of signatories.`;
      }
    }
    setError(newError);
  }, [policies]);

  return (
    <Box>
      <Typography variant="subtitle1" component="h2" sx={{ mb: 2 }}>
        Any one of the policies you define below will be able to approve transactions for your vault
      </Typography>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      {policies.map((policy, idx) => (
        <Accordion
          key={`policy-${idx}-${generatePolicyDeduplicationId(policy)}`}
          expanded={expanded === idx}
          onChange={handleExpandToggle(idx)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-content-${idx}`}
            id={`panel-header-${idx}`}
          >
            <Stack flexDirection="row" alignItems="center" justifyContent="space-between" flexGrow={1} sx={{ mr: 0.5 }}>
              <Typography variant="body1" fontWeight="500">
                {policy?.name ? policy?.name : `Policy #${idx + 1}`}:{' '}
                {getDisplayName(policy?.type ?? TransactionType.any)}
              </Typography>
              {idx > 0 || policies.length > 1 ? (
                <IconButton
                  color="primary"
                  aria-label="Remove policy"
                  component="label"
                  onClick={() => removePolicy(idx)}
                  sx={{ flexGrow: 0 }}
                >
                  <DeleteIcon />
                </IconButton>
              ) : null}
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <ManagePolicy data={policy} chain={chain} accounts={accounts} onChange={handlePolicyChange(idx)} />
          </AccordionDetails>
        </Accordion>
      ))}

      <Button variant="text" startIcon={<AddIcon />} onClick={handleAddPolicy} sx={{ mt: 2 }}>
        Add Policy
      </Button>
    </Box>
  );
}
