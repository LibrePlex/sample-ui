import type { NextPage } from "next";
import Head from "next/head";
import { BasicsView } from "../views";
import { WhatsNewView } from "@app/views/WhatsNewView";

const Basics: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>What's new</title>
        <meta name="What's new in LibrePlex" content="What's new" />
      </Head>
      <WhatsNewView />
    </div>
  );
};

export default Basics;
