import * as anchor from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";

export const PROGRAM_ID_CREATOR =
  "78deTr7qycJ6498vSd3pNMhdCKKWxMipniitVHQcM8RM";


import {IDL} from "@libreplex/idls/lib/cjs/libreplex_creator"
export function getProgramInstanceCreator(
  connection: Connection,
  wallet: any
) {
  if (!wallet.publicKey) return;
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  );
  const programId = PROGRAM_ID_CREATOR;
  const program = new anchor.Program(IDL, programId, provider);
  return program;
}
