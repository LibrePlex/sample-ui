import { Box, Spinner, Text } from "@chakra-ui/react";
import { Program } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { ReactNode, createContext, useEffect, useState } from "react";
import { Inscriptions } from "types/inscriptions";
import { getProgramInstanceOrdinals } from "./getProgramInstanceOrdinals";



export const OrdinalsProgramContext = createContext<Program<Inscriptions>>(
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
    const program = getProgramInstanceOrdinals(connection, {
      ...wallet,
      payer: Keypair.generate(),
    });
    setProgram(
      program,
    );
  }, [wallet, connection]);

  return program?.programId ? (
    <OrdinalsProgramContext.Provider value={program}>
      {children}
    </OrdinalsProgramContext.Provider>
  ) : (
    <Box sx={{display :"flex"}} columnGap={2}>
      <Text >
        Loading anchor program... 
      </Text>
      <Spinner />
    </Box>
  );
};
