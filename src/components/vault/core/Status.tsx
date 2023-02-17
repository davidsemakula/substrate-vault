import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ErrorIcon from '@mui/icons-material/Error';
import { generateId } from '../../../utils/helpers';

export enum StatusOption {
  initiating = 'initiating',
  processing = 'processing',
  canceled = 'canceled',
  completed = 'completed',
  failed = 'failed',
}

export type StatusStepInput = {
  title: string;
  subtitle?: string;
  description?: string;
};

type Props = {
  status: StatusOption;
  steps?: Array<StatusStepInput>;
  activeStep?: number;
};

export default function Status({ status = StatusOption.initiating, steps, activeStep = 0 }: Props) {
  let title,
    icon,
    instruction,
    canShowSteps = false;

  const stepsLength = (steps ?? []).length,
    stepProgressText = stepsLength > 1 ? `${Math.min(activeStep + 1, stepsLength)}/${stepsLength} ` : '';

  switch (status) {
    case StatusOption.processing: {
      title = `Transaction ${stepProgressText}is being executed.`;
      icon = <CircularProgress />;
      instruction = 'Please do not leave this page.';
      canShowSteps = true;
      break;
    }
    case StatusOption.canceled: {
      title = 'The transaction was canceled.';
      icon = <CancelIcon color="error" fontSize="large" />;
      instruction = 'Please cancel the process or retry the transaction.';
      break;
    }
    case StatusOption.completed: {
      title = 'Your Vault was created successfully!';
      icon = <CheckCircleIcon color="success" fontSize="large" />;
      instruction = '';
      break;
    }
    case StatusOption.failed: {
      title = 'Transaction execution failed.';
      icon = <ErrorIcon color="error" fontSize="large" />;
      instruction = 'Please make sure you have enough free balance and retry the transaction.';
      break;
    }
    default: {
      // Initiating is the default status
      title = 'Waiting for transaction confirmation.';
      icon = <CircularProgress />;
      instruction = `Please confirm ${
        stepsLength > 1 ? '' : 'the '
      }transaction ${stepProgressText}with your connected wallet.`;
      canShowSteps = true;
      break;
    }
  }

  return (
    <Stack alignItems="center" justifyContent="center" sx={{ p: 2, pt: 3 }}>
      {icon ? <Box sx={{ mb: 1 }}>{icon}</Box> : null}
      <Typography variant="h6" textAlign="center" sx={{ mb: 1 }}>
        {title}
      </Typography>

      {stepsLength && canShowSteps ? (
        <Stepper activeStep={activeStep} orientation="vertical" sx={{ my: 2 }}>
          {(steps ?? []).map((step, idx) => (
            <Step key={`step-${idx}-${generateId([step.title])}`}>
              <StepLabel optional={step.subtitle ? <Typography variant="caption">{step.subtitle}</Typography> : null}>
                {step.title}
              </StepLabel>
              {step.description ? <StepContent>{step.description}</StepContent> : null}
            </Step>
          ))}
        </Stepper>
      ) : null}

      {instruction ? (
        <Typography variant="body2" textAlign="center">
          {instruction}
        </Typography>
      ) : null}
    </Stack>
  );
}
