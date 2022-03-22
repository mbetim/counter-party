import { Button, Grid, Typography } from "@mui/material";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { PartyFormDialog, FormData } from "../components/dialogs/PartyFormDialog";
import { PageContainer } from "../components/PageContainer";
import { useSocket } from "../hooks/useSocket";
import { Party } from "../types/party";

interface Props {
  username: string;
}

const Home: NextPage<Props> = ({ username }) => {
  const router = useRouter();
  const { socket, connect } = useSocket();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (socket.connected) return;

    connect();

    socket.once("connect_error", () => {
      // TODO: Handle this error
      console.log("Failed to connect to socket");
    });
  }, [connect, socket, username]);

  const createParty = async (data: FormData) => {
    socket.emit("party:create", data, (party: Party) => {
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
          <Button variant="outlined" fullWidth onClick={() => setIsOpen(true)}>
            Create a party
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Button variant="outlined" fullWidth>
            Join a party
          </Button>
        </Grid>
      </Grid>

      <PartyFormDialog isOpen={isOpen} onClose={() => setIsOpen(false)} onSubmit={createParty} />
    </PageContainer>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { username } = parseCookies(ctx);

  if (!username)
    return {
      redirect: {
        destination: "/login",
        permanent: true,
      },
    };

  return {
    props: { username },
  };
};
