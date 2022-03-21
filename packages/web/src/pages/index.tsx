import { Typography } from "@mui/material";
import type { GetServerSideProps, NextPage } from "next";
import { parseCookies } from "nookies";

interface Props {
  username: string;
}

const Home: NextPage<Props> = ({ username }) => {
  return <Typography variant="h3">Hello, {username}</Typography>;
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
