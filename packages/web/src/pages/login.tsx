import { Box, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';
import React, { FormEvent } from 'react';
import { PageContainer } from '../components/PageContainer';

export const Login: React.FC = () => {
  const usernameRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const username = usernameRef.current?.value;

    if (!username) return;

    setCookie(null, 'username', username, { path: '/' });
    router.replace('/');
  };

  return (
    <PageContainer title="Login" shouldCheckUsername={false}>
      <Typography variant="h3" component="h1" fontWeight="bold" align="center">
        Counter party
      </Typography>

      <Typography variant="h5" color="text.secondary" align="center">
        Please, choose a username to continue
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          inputRef={usernameRef}
          name="username"
          label="Username"
          fullWidth
        />

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Submit
        </Button>
      </Box>
    </PageContainer>
  );
};

export default Login;
