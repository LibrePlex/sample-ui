import { Box, Spinner, Text } from "@chakra-ui/react";
import { Program } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { ReactNode, createContext, useEffect, useState } from "react";

import {LibreplexCreator} from "@libreplex/idls/lib/types/libreplex_creator"
import { getProgramInstanceCreator } from "./getProgramInstanceCreator";
import { LibreWallet } from "../metadata/MetadataProgramContext";
import { Keypair } from "@solana/web3.js";

export const LibrePlexCreatorProgramContext = createContext<Program<LibreplexCreator>>(
  undefined!
);

export const LibrePlexCreatorProgramProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const wallet = useWallet();

  const [program, setProgram] = useState<Program<LibreplexCreator>>();

  const { connection } = useConnection();

  useEffect(() => {
    const program = getProgramInstanceCreator(connection, new LibreWallet(Keypair.generate()));
    setProgram(program);
  }, [wallet, connection]);

  return program?.programId ? (
    <LibrePlexCreatorProgramContext.Provider value={program}>
      {children}
    </LibrePlexCreatorProgramContext.Provider>
  ) : (
    <Box sx={{ display: "flex" }} columnGap={2}>
      <Text>Loading creator program...</Text>
      <Spinner />
    </Box>
  );
};
