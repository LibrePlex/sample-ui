import * as anchor from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";

export const PROGRAM_ID_METADATA =
  "LibrQsXf9V1DmTtJLkEghoaF1kjJcAzWiEGoJn8mz7p";
export const PROGRAM_ID_INSCRIPTIONS =
  "inscokhJarcjaEs59QbQ7hYjrKz25LEPRfCbP8EmdUp";

import { IDL as IDLOrdinals } from "../types/inscriptions";

export function getProgramInstanceOrdinals(
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
  const idl = IDLOrdinals;
  // Address of the deployed program.
  const programId = PROGRAM_ID_INSCRIPTIONS;
  // Generate the program client from IDL.
  const program = new anchor.Program(idl, programId, provider);
  return program;
}
