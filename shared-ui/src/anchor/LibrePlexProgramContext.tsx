import { Box, Spinner, Text } from "@chakra-ui/react";
import { Program } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { ReactNode, createContext, useEffect, useState } from "react";
import {
  LibreplexWithOrdinals,
  getProgramInstanceMetadata,
} from "./getProgramInstanceMetadata";
import React from "react";

export const LibrePlexProgramContext = createContext<
  Program<LibreplexWithOrdinals>
>(undefined!);

export const LibrePlexProgramProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const wallet = useWallet();

  const [program, setProgram] = useState<Program<LibreplexWithOrdinals>>();

  const { connection } = useConnection();

  useEffect(() => {

    const publicKey = wallet.publicKey
    const signTransaction = wallet.signTransaction;
    const signAllTransactions = wallet.signAllTransactions;
    const anchorWallet = publicKey && signTransaction && signAllTransactions? {
      ...wallet,
      publicKey,
      signTransaction,
      signAllTransactions,
      payer: Keypair.generate(),
    } : undefined
    const program = anchorWallet ? 
    getProgramInstanceMetadata(connection, anchorWallet ): undefined;
    console.log({program}); 
    setProgram(program);
  }, [wallet, connection]);

  return program?.programId ? (
    <LibrePlexProgramContext.Provider value={program}>
      {children}
    </LibrePlexProgramContext.Provider>
  ) : (
    <Box sx={{ display: "flex" }} columnGap={2}>
      <Text>Loading anchor program...</Text>
      <Spinner />
    </Box>
  );
};
