import { Box, Spinner, Text } from "@chakra-ui/react";
import { Program, Wallet as  AnchorWallet} from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, Transaction } from "@solana/web3.js";
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

export class LibreWallet implements AnchorWallet {

  constructor(readonly payer: Keypair) {
      this.payer = payer
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
    // const publicKey = wallet.publicKey;
    // const signTransaction = wallet.signTransaction;
    // const signAllTransactions = wallet.signAllTransactions;
    // const anchorWallet =
    //   publicKey && signTransaction && signAllTransactions
    //     ? {
    //         ...wallet,
    //         publicKey,
    //         signTransaction,
    //         signAllTransactions,
    //         payer: Keypair.generate(),
    //       }
    //     : undefined;
    try {
    const _program =  getProgramInstanceMetadata(programId, connection, new LibreWallet(Keypair.generate()));
    // const _program = anchorWallet
    //   ? getProgramInstanceMetadata(programId, connection, anchorWallet)
    //   : undefined;
    console.log({ _program });
    setProgram(_program);
    } catch (e) {}
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
