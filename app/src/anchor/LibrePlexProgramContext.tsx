import { Box, Spinner, Text } from "@chakra-ui/react";
import { Program } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { ReactNode, createContext, useEffect, useState } from "react";
import { Libreplex } from "types/libreplex";
import { getProgramInstance } from "./getProgramInstance";

export interface ILibrePlexProgram {
  program: Program<Libreplex>;
}

export const LibrePlexProgramContext = createContext<ILibrePlexProgram>(
  undefined!
);

export const LibrePlexProgramProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const wallet = useWallet();

  const [program, setProgram] = useState<ILibrePlexProgram>();

  const { connection } = useConnection();

  useEffect(() => {
    const program = getProgramInstance(connection, {
      ...wallet,
      payer: Keypair.generate(),
    });
    setProgram({
      program,
    });
  }, [wallet, connection]);

  return program?.program?.programId ? (
    <LibrePlexProgramContext.Provider value={program}>
      {children}
    </LibrePlexProgramContext.Provider>
  ) : (
    <Box sx={{display :"flex"}} columnGap={2}>
      <Text >
        Loading anchor program... 
      </Text>
      <Spinner />
    </Box>
  );
};
