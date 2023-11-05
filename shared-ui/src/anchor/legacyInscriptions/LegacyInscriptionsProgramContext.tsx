import { Box, Spinner, Text } from "@chakra-ui/react";
import { Program, Wallet as AnchorWallet } from "@coral-xyz/anchor";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { Keypair, Transaction } from "@solana/web3.js";
import { ReactNode, createContext, useEffect, useRef, useState } from "react";
import { getProgramInstanceLegacyInscriptions } from "./getProgramInstanceLegacyInscriptions";
import React from "react";
import { PublicKey } from "@solana/web3.js";


import { LibreplexLegacy } from "../libreplex_legacy";

export const LibrePlexLegacyInscriptionsProgramContext = createContext<{
  program: Program<LibreplexLegacy>;
  setProgramId: (p: PublicKey) => any;
}>(undefined!);

export class LibreWallet implements AnchorWallet {
  constructor(readonly payer: Keypair) {
    this.payer = payer;
  }

  async signTransaction(tx: any): Promise<any> {
    tx.partialSign(this.payer);
    return tx;
  }

  async signAllTransactions(txs: any[]): Promise<any[]> {
    return txs.map((t) => {
      t.partialSign(this.payer);
      return t;
    });
  }

  get publicKey(): PublicKey {
    return this.payer.publicKey;
  }
}

export const LibrePlexLegacyInscriptionsProgramProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const wallet = useWallet();

  const [program, setProgram] = useState<Program<LibreplexLegacy>>();

  const [programId, setProgramId] = useState<PublicKey>(
    new PublicKey("Leg1xVbrpq5gY6mprak3Ud4q4mBwcJi5C9ZruYjWv7n")
  );

  const { connection } = useConnection();

  useEffect(() => {
    try {
      const _program = getProgramInstanceLegacyInscriptions(
        programId,
        connection,
        new LibreWallet(Keypair.generate())
      );
      setProgram(_program);
    } catch (e) {
      console.log(e, connection, program)
    }
  }, [wallet, connection, programId]);

  
  return program?.programId ? (
    <LibrePlexLegacyInscriptionsProgramContext.Provider value={{ program, setProgramId }}>
      {children}
    </LibrePlexLegacyInscriptionsProgramContext.Provider>
  ) : (
    <Box sx={{ display: "flex" }} columnGap={2}>
      <Text>Loading libreplex legacy program...</Text>
      <Spinner />
    </Box>
  );
};
