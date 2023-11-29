import { Box, Spinner, Text } from "@chakra-ui/react";
import { Program, Wallet as AnchorWallet } from "@coral-xyz/anchor";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { Keypair, Transaction } from "@solana/web3.js";
import { ReactNode, createContext, useEffect, useRef, useState } from "react";
import { getProgramInstanceLegacyInscriptions } from "../legacyInscriptions/getProgramInstanceLegacyInscriptions";
import React from "react";
import { PublicKey } from "@solana/web3.js";
import { LibreplexFairLaunch } from "./libreplex_fair_launch";
import { PROGRAM_ID_FAIR_LAUNCH } from "./constants";
import { getProgramInstanceFairLaunch } from "./getProgramInstanceFairLaunch";

export const FairLaunchProgramContext = createContext<{
  program: Program<LibreplexFairLaunch>;
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

export const FairLaunchProgramProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const wallet = useWallet();

  const [program, setProgram] = useState<Program<LibreplexFairLaunch>>();

  const [programId, setProgramId] = useState<PublicKey>(
    new PublicKey(PROGRAM_ID_FAIR_LAUNCH)
  );

  const { connection } = useConnection();

  useEffect(() => {
    try {
      const _program = getProgramInstanceFairLaunch(
        connection,
        new LibreWallet(Keypair.generate())
      );
      setProgram(_program);
    } catch (e) {
      console.log(e, connection, program);
    }
  }, [wallet, connection, programId]);

  return program?.programId ? (
    <FairLaunchProgramContext.Provider value={{ program, setProgramId }}>
      {children}
    </FairLaunchProgramContext.Provider>
  ) : (
    <></>
  );
};
