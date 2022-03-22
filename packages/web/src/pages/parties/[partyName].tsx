import { ContentCopy } from "@mui/icons-material";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { PageContainer } from "../../components/PageContainer";
import { useSocket } from "../../hooks/useSocket";
import { Party } from "../../types/party";

const PartyPage: NextPage = () => {
  const router = useRouter();
  const { socket, connect } = useSocket();
  const partyName = useMemo(() => router.query.partyName as string, [router.query.partyName]);

  const [party, setParty] = useState<Party | null>(null);

  useEffect(() => {
    if (socket.connected || !router.isReady) return;

    connect();

    socket.once("connect", () => {
      socket.emit("party:join", { name: partyName }, setParty);
    });

    socket.on("party:update", setParty);

    socket.on("exception", (err) => {
      // TODO: Handle this error
      console.log("exception", err);
    });
  }, [connect, partyName, router.isReady, socket]);

  const copyPartyName = () => {
    navigator.clipboard.writeText(partyName);
    alert("Copied to clipboard!");
  };

  return (
    <PageContainer title="Party">
      <Typography variant="h3" component="h1" align="center" sx={{ mb: 2 }}>
        <span>Party name: {partyName} </span>

        <IconButton onClick={copyPartyName}>
          <ContentCopy />
        </IconButton>
      </Typography>

      <List>
        {party?.connectedUsers.map((user) => (
          <ListItem key={user.username}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: "primary.main" }}>{user.username.substring(0, 2)}</Avatar>
            </ListItemAvatar>

            <ListItemText primary={user.username} secondary={`Points: ${user.points}`} />
          </ListItem>
        ))}
      </List>
    </PageContainer>
  );
};

export default PartyPage;
