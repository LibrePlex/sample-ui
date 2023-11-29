import * as anchor from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";

import { WalletContextState } from "@solana/wallet-adapter-react";
import { IDL} from "./libreplex_fair_launch";
import { PROGRAM_ID_FAIR_LAUNCH } from "./constants";
import { LibreplexFairLaunch } from "./libreplex_fair_launch";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export function getProgramInstanceFairLaunch(
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
  const program = new anchor.Program<LibreplexFairLaunch>(
    idl,
    PROGRAM_ID_FAIR_LAUNCH,
    provider
  )!;
  return program;
}
