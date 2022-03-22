import { CircularProgress, Container, Stack } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";

interface PagesContainerProps {
  title: string;
  shouldCheckUsername?: boolean;
}

export const PageContainer: React.FC<PagesContainerProps> = ({
  title,
  shouldCheckUsername = true,
  children,
}) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(shouldCheckUsername);

  useEffect(() => {
    const { username } = parseCookies(null);

    if (shouldCheckUsername && !username && router.pathname !== "/login") {
      router.replace("/login");
    } else {
      setIsLoading(false);
    }
  }, [router, shouldCheckUsername]);

  return (
    <Stack sx={{ height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <Head>
        <title>{title} - Counter party</title>
      </Head>

      {isLoading ? (
        <CircularProgress size={100} />
      ) : (
        <Container maxWidth="sm">{children}</Container>
      )}
    </Stack>
  );
};
