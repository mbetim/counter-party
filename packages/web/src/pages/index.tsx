import { Button, Grid, Typography } from "@mui/material";
import type { GetServerSideProps, NextPage } from "next";
import { parseCookies } from "nookies";
import { useEffect } from "react";
import { PageContainer } from "../components/PageContainer";
import { socket } from "../utils/socket";

interface Props {
  username: string;
}

const Home: NextPage<Props> = ({ username }) => {
  useEffect(() => {
    if (socket.connected) return;

    socket.auth = { username };
    socket.connect();

    socket.once("connect_error", () => {
      // TODO: Handle this error
      console.log("Failed to connect to socket");
    });

    return () => {
      socket.disconnect();
    };
  }, [username]);

  return (
    <PageContainer title="Home">
      <Typography variant="h3" align="center">
        Hello, {username}
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Button variant="outlined" fullWidth>
            Create a party
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Button variant="outlined" fullWidth>
            Join a party
          </Button>
        </Grid>
      </Grid>
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
