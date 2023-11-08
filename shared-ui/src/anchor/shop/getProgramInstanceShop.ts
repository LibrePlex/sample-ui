import * as anchor from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";

export const PROGRAM_ID_SHOP =
  "ListjawGEdhxuAErSyYwcTEGWQswFoi6FScnGG1RKSB";


import {IDL} from "@libreplex/idls/lib/cjs/libreplex_shop"
export function getProgramInstanceShop(
  connection: Connection,
  wallet: any
) {
  if (!wallet.publicKey) return;
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  );
  const programId = PROGRAM_ID_SHOP;
  const program = new anchor.Program(IDL, programId, provider);
  return program;
}
