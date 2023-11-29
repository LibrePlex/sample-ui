import { DeploymentDetailView } from "@app/views/fairlaunch/DeploymentDetailView";
import type { NextPage } from "next";
import Head from "next/head";

const Basics: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Fair Launch</title>
        <meta name="Fair Launch" content="Fair Launch Protocol" />
      </Head>
      <DeploymentDetailView />
    </div>
  );
};

export default Basics;
