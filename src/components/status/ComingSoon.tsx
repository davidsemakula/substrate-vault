import React from 'react';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import AppStatus from './AppStatus';

export default function ComingSoon() {
  return (
    <AppStatus
      title="Coming soon."
      icon={<SentimentSatisfiedAltIcon color="primary" fontSize="large" sx={{ mb: 1 }} />}
      subtitle="This feature will soon be added in an update. Stay tuned!"
    />
  );
}
