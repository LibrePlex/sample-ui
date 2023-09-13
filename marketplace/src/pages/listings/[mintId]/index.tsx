import { Button } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { MintDisplay, usePublicKeyOrNull } from "@libreplex/shared-ui";
const Home: NextPage = (props) => {
  const router = useRouter();

  const mintId = useMemo(() => router.query.mintId, [router]);

  const clearMint = useCallback(() => {
    router.query.mintId = undefined;
    router.push(router);
  }, [router.query]);

  const mintPublicKey = usePublicKeyOrNull(mintId as string);
  return (
    <div style={{ position: "relative" }}>
      <Button
        sx={{ zIndex: 10, position: "absolute", top: 10, left: 10 }}
        onClick={() => {
          clearMint();
        }}
      >
        Back to listings
      </Button>
      {mintPublicKey && <MintDisplay mint={mintPublicKey} />}
    </div>
  );
};

export default Home;
