import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useUser } from '../../user/UserContext';

const VerificationAlert = () => {
  const { user } = useUser();
  const [open, setOpen] = React.useState(true);

  if (user.emailVerified) return null;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar open={open} onClose={handleClose}>
      <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
        Please verify your email to access all features!
      </Alert>
    </Snackbar>
  );
};

export default VerificationAlert;