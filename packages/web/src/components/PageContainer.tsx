import { Container, Stack } from "@mui/material";
import Head from "next/head";
import React from "react";

interface PagesContainerProps {
  title: string;
}

export const PageContainer: React.FC<PagesContainerProps> = ({ title, children }) => {
  return (
    <Stack sx={{ height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <Head>
        <title>{title} - Counter party</title>
      </Head>

      <Container maxWidth="sm">{children}</Container>
    </Stack>
  );
};
