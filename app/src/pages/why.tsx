import type { NextPage } from "next";
import Head from "next/head";
import { BasicsView } from "../views";
import { WhyView } from "views/why";

const Basics: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Why LibrePlex?</title>
        <meta
          name="description"
          content="Why does LibrePlex exist?"
        />
      </Head>
      <WhyView />
    </div>
  );
};

export default Basics;
