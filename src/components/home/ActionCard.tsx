import React, { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export type Props = {
  title: string;
  description: string;
  action: string;
  icon: ReactElement;
  path: string;
};

export default function ActionCard({ title, description, action, icon, path }: Props) {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 2, height: 1, display: 'flex', flexDirection: 'column' }} elevation={3}>
      <Box flexGrow={1}>
        <Typography variant="h6" mb={1} display="flex" alignItems="center">
          {icon}
          <Box sx={{ ml: 1 }}>{title}</Box>
        </Typography>

        <Typography variant="body2" mb={2}>
          {description}
        </Typography>
      </Box>

      <Button variant="contained" startIcon={icon} sx={{ mb: 1, width: 'max-content' }} onClick={() => navigate(path)}>
        {action}
      </Button>
    </Paper>
  );
}
