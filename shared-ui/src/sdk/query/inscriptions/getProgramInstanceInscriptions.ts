import * as anchor from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";


export const PROGRAM_ID_INSCRIPTIONS =
  "inscokhJarcjaEs59QbQ7hYjrKz25LEPRfCbP8EmdUp";

import { IDL } from "../../../anchor/libreplex_inscriptions";

export function getProgramInstanceInscriptions(
  connection: Connection,
  wallet: anchor.Wallet
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
  const programId = PROGRAM_ID_INSCRIPTIONS;
  // Generate the program client from IDL.
  const program = new anchor.Program(idl, programId, provider);
  return program;
}
