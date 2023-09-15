import React from "react";
import { Box, Spinner, Text } from "@chakra-ui/react";
import { Program } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { ReactNode, createContext, useEffect, useState } from "react";
import { getProgramInstanceInscriptions } from "./getProgramInstanceInscriptions";
import { InscriptionStoreProvider } from "./InscriptionStoreContext";

import { LibreWallet } from "../../../anchor/metadata/MetadataProgramContext";

import { LibreplexInscriptions } from "@libreplex/idls/lib/cjs/libreplex_inscriptions";


export const InscriptionsProgramContext = createContext<
  Program<LibreplexInscriptions>
>(undefined!);

export const InscriptionsProgramProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const wallet = useWallet();

  const [program, setProgram] = useState<Program<LibreplexInscriptions>>();

  const { connection } = useConnection();

  useEffect(() => {
    const program = getProgramInstanceInscriptions(
      connection,
      new LibreWallet(Keypair.generate())
    );

    setProgram(program);
  }, [wallet, connection]);

  return program?.programId ? (
    <InscriptionsProgramContext.Provider value={program}>
      <InscriptionStoreProvider>{children}</InscriptionStoreProvider>
    </InscriptionsProgramContext.Provider>
  ) : (
    <Box sx={{ display: "flex" }} columnGap={2}>
      <Text>Loading inscriptions program...</Text>
      <Spinner />
    </Box>
  );
};
