import type { NextPage } from "next";
import Head from "next/head";
import { BasicsView } from "../../views";
import InscriptionsView from "../../views/inscriptions/InscriptionsView";
import React from "react";
import FairLaunchView from "@app/views/fairlaunch/FairLaunchView";

const Basics: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Fair Launch</title>
        <meta name="Fair Launch" content="Fair Launch Protocol" />
      </Head>
      <FairLaunchView />
    </div>
  );
};

export default Basics;
