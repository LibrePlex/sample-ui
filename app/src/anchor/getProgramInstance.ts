import * as anchor from "@project-serum/anchor";
import { Connection, Keypair } from "@solana/web3.js";

export const PROGRAM_ID = "AJ5Hh5q4HegZWWu1ScY7ZRA6zELXmRzEWS5EXFSKqBC6";

import { IDL } from "types/libreplex";

export function getProgramInstance(connection: Connection, wallet: anchor.Wallet) {
  if (!wallet.publicKey) return;
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  );
  // Read the generated IDL.
  const idl = IDL;
  // Address of the deployed program.
  const programId = PROGRAM_ID;
  // Generate the program client from IDL.
  const program = new anchor.Program(idl, programId, provider);
  return program;
}
