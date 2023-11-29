import { PROGRAM_ADDRESS } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";


export function getMasterEditionPda(tokenMint: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        new PublicKey(PROGRAM_ADDRESS).toBuffer(),
        tokenMint.toBuffer(),
        Buffer.from("edition"),
      ],
      new PublicKey(PROGRAM_ADDRESS)
    );
  }
  