import { Box, Spinner, Text } from "@chakra-ui/react";
import { Program } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { ReactNode, createContext, useEffect, useState } from "react";
import { LibreplexShop } from "../../types/libreplex_shop";
import { getProgramInstanceShop } from "./getProgramInstanceShop";
import { LibreWallet } from "../metadata/MetadataProgramContext";
import { Keypair } from "@solana/web3.js";

export const LibrePlexShopProgramContext = createContext<Program<LibreplexShop>>(
  undefined!
);

export const LibrePlexShopProgramProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const wallet = useWallet();

  const [program, setProgram] = useState<Program<LibreplexShop>>();

  const { connection } = useConnection();

  useEffect(() => {
    const program = getProgramInstanceShop(connection, new LibreWallet(Keypair.generate()));
    setProgram(program);
  }, [wallet, connection]);

  return program?.programId ? (
    <LibrePlexShopProgramContext.Provider value={program}>
      {children}
    </LibrePlexShopProgramContext.Provider>
  ) : (
    <Box sx={{ display: "flex" }} columnGap={2}>
      <Text>Loading shop program...</Text>
      <Spinner />
    </Box>
  );
};
