import { PublicKey } from '@solana/web3.js';

const LISTING = "listing";
export const PROGRAM_ID_LISTINGS =
  "ListjawGEdhxuAErSyYwcTEGWQswFoi6FScnGG1RKSB"

export const getListingPda = (mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(LISTING), mint.toBuffer()],
    new PublicKey(PROGRAM_ID_LISTINGS)
  );
};
