import React from 'react';
import AppStatus from './AppStatus';
import { ChainInfo } from '../../utils/types';
import ErrorIcon from '@mui/icons-material/Error';

type Props = {
  chain: ChainInfo;
};

export default function UnsupportedChain({ chain }: Props) {
  return (
    <AppStatus
      title={`${chain?.text ? chain?.text : 'This chain'} is not currently supported.`}
      icon={<ErrorIcon color="error" fontSize="large" sx={{ mb: 1 }} />}
      subtitle="Please select another chain."
    />
  );
}
