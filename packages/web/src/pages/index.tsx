import { Button, Grid, Typography } from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect } from "react";
import { JoinPartyDialog } from "../components/dialogs/JoinPartyDialog";
import {
  FormData as CreatePartyFormData,
  PartyFormDialog,
} from "../components/dialogs/PartyFormDialog";
import { PageContainer } from "../components/PageContainer";
import { useDialog } from "../hooks/useDialog";
import { useSocket } from "../hooks/useSocket";
import { Party } from "../types/party";

const Home: NextPage = () => {
  const router = useRouter();
  const { socket, connect } = useSocket();
  const { username } = parseCookies(null);

  const partyFormDialog = useDialog();
  const joinPartyDialog = useDialog();

  useEffect(() => {
    if (socket.connected) return;

    connect();
  }, [connect, socket, username]);

  const createParty = async (data: CreatePartyFormData) => {
    const incrementOptions = Array.from(new Set(data.incrementOptions));

    socket.emit("party:create", { incrementOptions }, (party: Party) => {
      router.push(`/parties/${party.name}`);
      console.log("party created", party);
    });
  };

  return (
    <PageContainer title="Home">
      <Typography variant="h3" align="center">
        Hello, {username}
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Button variant="outlined" fullWidth onClick={partyFormDialog.open}>
            Create a party
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Button variant="outlined" fullWidth onClick={joinPartyDialog.open}>
            Join a party
          </Button>
        </Grid>
      </Grid>

      <PartyFormDialog
        isOpen={partyFormDialog.isOpen}
        onClose={partyFormDialog.close}
        onSubmit={createParty}
      />

      <JoinPartyDialog
        isOpen={joinPartyDialog.isOpen}
        onClose={joinPartyDialog.close}
        onSubmit={({ name }) => router.push(`/parties/${name}`)}
      />
    </PageContainer>
  );
};

export default Home;
