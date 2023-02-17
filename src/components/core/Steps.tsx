import React, { ReactElement, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SendIcon from '@mui/icons-material/Send';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import useIsMobile from '../../hooks/useIsMobile';
import { generateId } from '../../utils/helpers';
import Title from './Title';

export type StepInput = {
  title: string;
  content: any; // TODO: Figure out why type isn't working
  props?: object | null;
  optional?: boolean;
};

type Props<S, P> = {
  // Dynamic state, S = data and props P = props types
  title: string;
  steps: Array<StepInput>;
  data?: S | null;
  props?: P | null;
  successContent?: ReactElement | null;
  successBtn?: string;
  canRetry?: boolean;
  onStepChange: (step: number) => void;
  onDataChange?: (step: number, data?: S | null) => void;
};

export type StepProps<T> = {
  step?: number;
  data: T;
  isValid?: boolean;
  onChange: (isValid: boolean, data?: T | null) => void;
};

export default function Steps<S, P>({
  // Dynamic state, S = data and props P = props types
  title,
  steps,
  data,
  props,
  successContent,
  successBtn,
  canRetry,
  onStepChange,
  onDataChange,
}: Props<S, P>) {
  const isMobile = useIsMobile();
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [validated, setValidated] = useState(new Set<number>());

  const isStepOptional = (step: number) => {
    return steps[step]?.optional;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const isStepValidated = (step: number) => {
    return validated.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleStepChange = (isValid: boolean, inputData?: S | null) => {
    setValidated((prevValidated) => {
      const newValidated = new Set(prevValidated.values());
      if (isValid) {
        newValidated.add(activeStep);
      } else {
        newValidated.delete(activeStep);
      }
      return newValidated;
    });
    onDataChange && onDataChange(activeStep, inputData);
  };

  useEffect(() => {
    onStepChange && onStepChange(activeStep);
  }, [activeStep]);

  const isLastStep = activeStep === steps.length - 1,
    isCompleted = activeStep === steps.length;

  const renderStepContent = (step: number) => {
    const Content = steps[step]?.content,
      stepProps = steps[step]?.props;
    return Content ? (
      <Content
        {...stepProps}
        {...props}
        step={step}
        data={data}
        isValid={isStepValidated(step)}
        onChange={handleStepChange}
      />
    ) : null;
  };

  const stepActions = (
    <Box sx={{ display: 'flex', flexDirection: 'row', py: 2 }}>
      {isCompleted ? (
        canRetry ? (
          <>
            <Box sx={{ flex: '1 1 auto' }} /> {/* Right aligns the retry button */}
            <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={handleReset}>
              Retry
            </Button>
          </>
        ) : null
      ) : (
        <>
          <Button
            variant="outlined"
            startIcon={<NavigateBeforeIcon />}
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {isStepOptional(activeStep) ? (
            <Button
              variant="outlined"
              endIcon={<SkipNextIcon />}
              disabled={isStepValidated(activeStep)}
              onClick={handleSkip}
              sx={{ mr: 1 }}
            >
              Skip
            </Button>
          ) : null}
          <Button
            variant="contained"
            startIcon={isLastStep ? <SendIcon /> : null}
            endIcon={isLastStep ? null : <NavigateNextIcon />}
            disabled={!isStepValidated(activeStep)}
            onClick={handleNext}
          >
            {isLastStep ? successBtn ?? 'Finish' : 'Next'}
          </Button>
        </>
      )}
    </Box>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Title>{title}</Title>
      <Stepper activeStep={activeStep} orientation={isMobile ? 'vertical' : 'horizontal'} sx={{ sm: 2 }}>
        {steps.map(({ title }: StepInput, idx) => {
          return (
            <Step key={`step-${idx}-${generateId([title])}`} completed={isStepSkipped(idx) ? false : undefined}>
              <StepLabel optional={isStepOptional(idx) ? <Typography variant="caption">Optional</Typography> : null}>
                {title}
              </StepLabel>
              {isMobile ? (
                <StepContent>
                  {renderStepContent(idx)}
                  {stepActions}
                </StepContent>
              ) : null}
            </Step>
          );
        })}
      </Stepper>
      {!isMobile || (isCompleted && successContent) ? (
        <>
          <Box sx={{ py: 2 }}>{isCompleted ? successContent : renderStepContent(activeStep)}</Box>
          {stepActions}
        </>
      ) : null}
    </Box>
  );
}
