import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

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
      <HomeView />
    </div>
  );
};

export default Home;
