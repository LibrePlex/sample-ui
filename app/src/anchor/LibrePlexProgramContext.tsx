import { Box, Spinner, Text } from "@chakra-ui/react";
import { Program } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { ReactNode, createContext, useEffect, useState } from "react";
import {
  LibreplexWithOrdinals,
  getProgramInstance,
} from "./getProgramInstance";

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
    const program = getProgramInstance(connection, {
      ...wallet,
      payer: Keypair.generate(),
    });
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
