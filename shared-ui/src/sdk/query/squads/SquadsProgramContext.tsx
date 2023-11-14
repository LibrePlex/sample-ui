import React from "react";
import { Box, Spinner, Text } from "@chakra-ui/react";
import { Program } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { ReactNode, createContext, useEffect, useState } from "react";

import { LibreWallet } from "../../../anchor/metadata/MetadataProgramContext";
import { SquadsMpl } from "../../../anchor/squads/squads";
import { getProgramInstanceSquads } from "../../../anchor/squads/getProgramInstanceSquads";

export const SquadsProgramContext = createContext<
  Program<SquadsMpl>
>(undefined!);

export const SquadsProgramProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const wallet = useWallet();

  const [program, setProgram] = useState<Program<SquadsMpl>>();

  const { connection } = useConnection();

  useEffect(() => {
    const program = getProgramInstanceSquads(
      connection,
      new LibreWallet(Keypair.generate())
    );

    setProgram(program);
  }, [wallet, connection]);

  return program?.programId ? (
    <SquadsProgramContext.Provider value={program}>
      {children}
    </SquadsProgramContext.Provider>
  ) : (
    <Box sx={{ display: "flex" }} columnGap={2}>
      <Text>Loading squads program...</Text>
      <Spinner />
    </Box>
  );
};
