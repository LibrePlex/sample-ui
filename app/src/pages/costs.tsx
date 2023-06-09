import type { NextPage } from "next";
import Head from "next/head";
import { CostsView } from "@/views/costs/CostsView";

const Basics: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Cost comparison</title>
        <meta name="description" content="Legacy standard -v- LibrePlex" />
      </Head>
      <CostsView />
    </div>
  );
};

export default Basics;
