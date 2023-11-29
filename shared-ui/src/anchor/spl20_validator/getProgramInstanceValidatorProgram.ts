import * as anchor from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";


export const PROGRAM_ID_INSCRIPTIONS =
  "SPLsCpfTUEZe43PDw9KXnw6eJfKVZoKYCGGPY29S3fN";


import { WalletContextState } from "@solana/wallet-adapter-react";
import { IDL } from "./spl20_validator";


export function getProgramInstanceValidator(
  connection: Connection,
  wallet: Pick<WalletContextState, 'publicKey' |'signAllTransactions'|'signTransaction'>
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
