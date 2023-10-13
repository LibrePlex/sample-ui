import { CreatorsView } from "creator/src/views/CreatorsView";
import type { NextPage } from "next";
import Head from "next/head";

const CreatorPage: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Libreplex Creator</title>
        <meta
          name="description"
          content="View detail for a single creator"
        />
      </Head>
      {/* <CreatorsView /> */}
    </div>
  );
};

export default CreatorPage;
