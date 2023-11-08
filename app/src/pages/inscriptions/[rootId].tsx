import { Router } from "express";
import { useRouter } from "next/router";
import { useMemo } from "react";
import Head from "next/head";
import { Box } from "@chakra-ui/react";

export const InscriptionDetail = () => {
  const router = useRouter();

  const rootId = useMemo(() => router.query.rootId, [router]);

  return (
    <div>
      <Head>
        <title>On-Chain Inscriptions</title>
        <meta name="What's new in LibrePlex" content="What's new" />
      </Head>
      <Box>Inscription detail {rootId}</Box>
    </div>
  );
};

export default InscriptionDetail;
