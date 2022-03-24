import { ArrowBack, ContentCopy } from '@mui/icons-material';
import {
  Avatar,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { useSnackbar } from 'notistack';
import React, { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '../../components/PageContainer';
import { useSocket } from '../../hooks/useSocket';
import { Party } from '../../types/party';

const PartyPage: NextPage = () => {
  const router = useRouter();
  const { socket, connect } = useSocket();
  const partyName = useMemo(
    () => router.query.partyName as string,
    [router.query.partyName],
  );
  const { enqueueSnackbar } = useSnackbar();

  const [party, setParty] = useState<Party | null>(null);

  const { username: currentUser } = parseCookies(null);

  useEffect(() => {
    if (socket.connected || !router.isReady) return;

    connect();

    socket.once('connect', () => {
      socket.emit('party:join', { name: partyName }, setParty);
    });

    socket.on('party:update', setParty);
  }, [connect, partyName, router.isReady, socket]);

  const sortedConnectedUsers = useMemo(() => {
    if (!party) return [];

    return party.connectedUsers.sort((a, b) =>
      a.username.localeCompare(b.username),
    );
  }, [party]);

  const sortedIncrementOptions = useMemo(() => {
    if (!party) return [];

    if (party.incrementOptions.length >= 6)
      return party.incrementOptions.sort();

    const negativeSortedValues = party.incrementOptions
      .filter((value) => value < 0)
      .sort()
      .reverse();
    const positiveSortedValues = party.incrementOptions
      .filter((value) => value > 0)
      .sort();

    return [...negativeSortedValues, ...positiveSortedValues];
  }, [party]);

  const copyPartyName = () => {
    navigator.clipboard.writeText(partyName);
    enqueueSnackbar('Party name copied to clipboard');
  };

  const updateCounter = (value: number) => {
    socket.emit('party:update-counter', { points: value });
  };

  return (
    <PageContainer title="Party">
      <Stack direction="row" alignItems="center" spacing={1}>
        <Tooltip title="Leave" arrow>
          <IconButton onClick={() => router.push('/')}>
            <ArrowBack />
          </IconButton>
        </Tooltip>

        <Typography variant="h4" component="h1" align="center" sx={{ flex: 1 }}>
          <span>Party: {partyName} </span>

          <Tooltip title="Copy party name" arrow>
            <IconButton onClick={copyPartyName}>
              <ContentCopy />
            </IconButton>
          </Tooltip>
        </Typography>
      </Stack>

      <List sx={{ my: 2 }}>
        {sortedConnectedUsers.map((user) => (
          <ListItem key={user.username}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {user.username.substring(0, 2)}
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={
                user.username +
                `${user.username === currentUser ? ' (You)' : ''}`
              }
              secondary={`Points: ${user.points}`}
            />
          </ListItem>
        ))}
      </List>

      <Grid container spacing={2}>
        {sortedIncrementOptions.map((option) => (
          <Grid
            item
            xs={sortedIncrementOptions.length >= 6 ? 4 : true}
            key={option}
          >
            <Button
              variant="contained"
              fullWidth
              onClick={() => updateCounter(option)}
            >
              {option}
            </Button>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
};

export default PartyPage;
