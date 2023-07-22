import { Box, Spinner, Text } from "@chakra-ui/react";
import { Program, Wallet as AnchorWallet } from "@coral-xyz/anchor";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { Keypair, Transaction } from "@solana/web3.js";
import { ReactNode, createContext, useEffect, useRef, useState } from "react";
import { getProgramInstanceMetadata } from "./getProgramInstanceMetadata";
import React from "react";
import { PublicKey } from "@solana/web3.js";
import { LibreplexMetadata } from "../../types/libreplex_metadata";
import { StoreApi } from "zustand";
import { DeletedKeysState, createDeletedKeyStore } from "../../stores/deletedKeyStore";

export const MetadataProgramContext = createContext<{
  program: Program<LibreplexMetadata>;
  store: StoreApi<DeletedKeysState>,
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

export const MetadataProgramProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const wallet = useWallet();

  const [program, setProgram] = useState<Program<LibreplexMetadata>>();

  const [programId, setProgramId] = useState<PublicKey>(
    new PublicKey("LibrQsXf9V1DmTtJLkEghoaF1kjJcAzWiEGoJn8mz7p")
  );

  const { connection } = useConnection();

  useEffect(() => {
    try {
      const _program = getProgramInstanceMetadata(
        programId,
        connection,
        new LibreWallet(Keypair.generate())
      );
      setProgram(_program);
    } catch (e) {}
  }, [wallet, connection, programId]);



  const [store, setStore] = useState<StoreApi<DeletedKeysState>>();

  useEffect(() => {
    if (program) {
      setStore(createDeletedKeyStore(program));
    }
  }, [program]);


  return program?.programId && store ? (
    <MetadataProgramContext.Provider value={{ program, store, setProgramId }}>
      {children}
    </MetadataProgramContext.Provider>
  ) : (
    <Box sx={{ display: "flex" }} columnGap={2}>
      <Text>Loading metadata program...</Text>
      <Spinner />
    </Box>
  );
};
