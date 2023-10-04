import type { NextPage } from "next";
import Head from "next/head";
import { BasicsView } from "../views";
import { FeaturesView } from "@app/views/FeaturesView";

const Basics: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>New stuff in Libreplex</title>
        <meta name="What's new in LibrePlex" content="What's new" />
      </Head>
      <FeaturesView />
    </div>
  );
};

export default Basics;
