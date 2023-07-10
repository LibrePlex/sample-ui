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
import { PublicKey } from "@solana/web3.js";

export const LibrePlexProgramContext = createContext<{
  program: Program<LibreplexWithOrdinals>;
  setProgramId: (p: PublicKey) => any;
}>(undefined!);

export const LibrePlexProgramProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const wallet = useWallet();

  const [program, setProgram] = useState<Program<LibreplexWithOrdinals>>();

  const [programId, setProgramId] = useState<PublicKey>(new PublicKey("LibrQsXf9V1DmTtJLkEghoaF1kjJcAzWiEGoJn8mz7p"));

  const { connection } = useConnection();

  useEffect(() => {
    const publicKey = wallet.publicKey;
    const signTransaction = wallet.signTransaction;
    const signAllTransactions = wallet.signAllTransactions;
    const anchorWallet =
      publicKey && signTransaction && signAllTransactions
        ? {
            ...wallet,
            publicKey,
            signTransaction,
            signAllTransactions,
            payer: Keypair.generate(),
          }
        : undefined;
    const _program = anchorWallet
      ? getProgramInstanceMetadata(programId, connection, anchorWallet)
      : undefined;
    console.log({ _program });
    setProgram(_program);
  }, [wallet, connection, programId]);

  return program?.programId ? (
    <LibrePlexProgramContext.Provider value={{program, setProgramId}}>
      {children}
    </LibrePlexProgramContext.Provider>
  ) : (
    <Box sx={{ display: "flex" }} columnGap={2}>
      <Text>Loading anchor program...</Text>
      <Spinner />
    </Box>
  );
};
