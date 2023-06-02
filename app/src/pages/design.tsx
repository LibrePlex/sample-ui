import type { NextPage } from "next";
import Head from "next/head";
import { BasicsView } from "../views";

const Basics: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Tech Design</title>
        <meta
          name="description"
          content="Design"
        />
      </Head>
      <BasicsView />
    </div>
  );
};

export default Basics;
