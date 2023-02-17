import React, { ReactElement, useState } from 'react';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { SxProps } from '@mui/material';

import PickerDisplay from './PickerDisplay';

type Props = {
  primaryLabel?: string;
  secondaryLabel?: string;
  display?: ReactElement | null;
  dropdown: any; // TODO: Figure out why type isn't working
  dropdownProps?: object;
  icon?: ReactElement | null;
  sx?: SxProps;
  className?: string;
};

const StyledPickerButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  cursor: 'pointer',
  justifyContent: 'space-between',
  alignItems: 'center',
  minWidth: 180,
  padding: theme.spacing(1, 1.5),
  backgroundColor: alpha(theme.palette.primary.contrastText, 0.15),
  borderRadius: theme.shape.borderRadius,
}));

export default function Picker({
  primaryLabel,
  secondaryLabel,
  display,
  dropdown: Dropdown,
  dropdownProps,
  icon,
  sx,
  className,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={sx} className={className}>
      <StyledPickerButton onClick={handleToggle}>
        {icon}
        {display ?? <PickerDisplay primary={primaryLabel ?? ''} secondary={secondaryLabel} />}
        {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </StyledPickerButton>
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
        }}
        open={open}
        onClick={handleClose}
      >
        <Container maxWidth="xs" sx={{ m: 0, mr: { sm: 6 } }}>
          <Toolbar /> {/* Spacer */}
          <Paper onClick={(e) => e.stopPropagation()}>
            {Dropdown ? <Dropdown {...dropdownProps} onClose={handleClose} /> : null}
          </Paper>
        </Container>
      </Backdrop>
    </Box>
  );
}
