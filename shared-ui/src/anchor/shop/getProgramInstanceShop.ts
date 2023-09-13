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
  // Read the generated IDL.
  const idl = IDL;
  // Address of the deployed program.
  const programId = PROGRAM_ID_SHOP;
  // Generate the program client from IDL.
  const program = new anchor.Program(idl, programId, provider);
  return program;
}
