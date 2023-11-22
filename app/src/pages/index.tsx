import React from "react";
import type { NextPage } from "next";
import { HomeView } from "../views";
import { NextSeo } from "next-seo";

const Home: NextPage = () => {
  return (
    <>
      <NextSeo title="Web3 digital asset standard for Solana" />
      <HomeView />
    </>
  );
};

export default Home;
