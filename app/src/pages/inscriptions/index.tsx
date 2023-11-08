import type { NextPage } from "next";
import Head from "next/head";
import { BasicsView } from "../../views";
import InscriptionsView from "../../views/inscriptions/InscriptionsView";
import React from "react";

const Basics: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>On-Chain Inscriptions</title>
        <meta name="What's new in LibrePlex" content="What's new" />
      </Head>
      <InscriptionsView />
    </div>
  );
};

export default Basics;
