import React from "react";
import { Box, Spinner, Text } from "@chakra-ui/react";
import { Program } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { ReactNode, createContext, useEffect, useState } from "react";
import { Inscriptions } from "../types/inscriptions";
import { getProgramInstanceOrdinals } from "./getProgramInstanceOrdinals";
import { LibreWallet } from "./LibrePlexProgramContext";

export const InscriptionsProgramContext = createContext<Program<Inscriptions>>(
  undefined!
);

export const InscriptionsProgramProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const wallet = useWallet();

  const [program, setProgram] = useState<Program<Inscriptions>>();

  const { connection } = useConnection();

  useEffect(() => {
    const program = getProgramInstanceOrdinals(connection, 
      new LibreWallet(Keypair.generate())
    );
    
    setProgram(
      program,
    );
  }, [wallet, connection]);

  return program?.programId ? (
    <InscriptionsProgramContext.Provider value={program}>
      {children}
    </InscriptionsProgramContext.Provider>
  ) : (
    <Box sx={{display :"flex"}} columnGap={2}>
      <Text >
        Loading anchor program... 
      </Text>
      <Spinner />
    </Box>
  );
};
