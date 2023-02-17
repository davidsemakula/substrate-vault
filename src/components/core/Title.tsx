import React from 'react';
import Typography from '@mui/material/Typography';
import { TypographyProps } from '@mui/material/Typography/Typography';

import useIsMobile from '../../hooks/useIsMobile';

export default function Title({ children, ...rest }: TypographyProps): React.ReactElement {
  const isMobile = useIsMobile();
  return (
    <Typography variant={isMobile ? 'h5' : 'h4'} mb={3} component="h1" {...(rest as any)}>
      {children}
    </Typography>
  );
}
