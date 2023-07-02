import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";
import { ContextProvider } from "shared-ui";
import React from "react";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>LibrePlex</title>
        <meta
          name="description"
          content="LibrePlex digital asset standard for Solana"
        />
      </Head>
      <ContextProvider>
        <HomeView />
      </ContextProvider>
    </div>
  );
};

export default Home;
