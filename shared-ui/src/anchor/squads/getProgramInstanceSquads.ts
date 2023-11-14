import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";

export const PROGRAM_ID_SQUADS = "SMPLecH534NA9acpos4G6x7uf3LWbCAwZQE9e8ZekMu";

import { WalletContextState } from "@solana/wallet-adapter-react";
import { IDL, SquadsMpl } from "./squads";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export function getProgramInstanceSquads(
  connection: Connection,
  wallet: Pick<
    WalletContextState,
    "publicKey" | "signAllTransactions" | "signTransaction"
  >
) {
  if (
    !wallet.publicKey ||
    !wallet.signAllTransactions ||
    !wallet.signTransaction
  ) {
    throw Error("Wallet not ready");
  }

  const nodeWallet = {
    signTransaction: wallet.signTransaction!,
    signAllTransactions: wallet.signAllTransactions!,
    publicKey: wallet.publicKey!,
  };

  const provider = new anchor.AnchorProvider(
    connection,
    nodeWallet,
    anchor.AnchorProvider.defaultOptions()
  );
  const idl = IDL;
  const program = new anchor.Program<SquadsMpl>(idl, new PublicKey(PROGRAM_ID_SQUADS), provider)!;
  return program;
}
