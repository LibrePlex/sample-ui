import { Box } from "@chakra-ui/react";
import { CreatorsView } from "creator/src/views/CreatorsView";
import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Libreplex Creators</title>
        <meta
          name="description"
          content="View and manage all the creators you own"
        />
      </Head>
      <Box
        w={"100vw"}
        h={"100%"}
        display={"flex"}
        flexDirection={"column"}
        sx={{
          alignItems: "center",
        }}
      >
        <CreatorsView />
      </Box>
    </div>
  );
};

export default Home;
