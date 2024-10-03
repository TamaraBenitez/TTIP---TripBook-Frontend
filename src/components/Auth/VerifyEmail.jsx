import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Button,
  Alert,
} from '@mui/material';
import StoreContext from '../../store/storecontext';

const VerifyEmail = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const [searchParams] = useSearchParams(); 
  const token = searchParams.get('token'); 
  const store = useContext(StoreContext)
  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid or missing verification token.');
        return;
      }

      try {
        const response = await store.services.authService.verifyEmail(token);

        if (response.data && response.data.success) {
          setStatus('success');
          setMessage('Your email has been successfully verified!');
        } else {
          setStatus('error');
          setMessage(response.data.message || 'Email verification failed.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('The token is invalid or has expired.');
      }
    };

    verifyEmailToken();
  }, [token]);

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        {status === 'loading' && (
          <>
            <CircularProgress />
            <Typography variant="h6" mt={2}>
              {message}
            </Typography>
          </>
        )}

        {status === 'success' && (
          <Alert severity="success">
            <Typography variant="h6">
              {message}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href="/login"
              sx={{ mt: 2 }}
            >
              Go to Login
            </Button>
          </Alert>
        )}

        {status === 'error' && (
          <Alert severity="error">
            <Typography variant="h6">
              {message}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href="/"
              sx={{ mt: 2 }}
            >
              Go to Home
            </Button>
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default VerifyEmail;