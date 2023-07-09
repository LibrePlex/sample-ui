import { PublicKey } from '@solana/web3.js';

const LISTING_FILTER = "listing_filter";
export const PROGRAM_ID_LISTINGS =
  "ListjawGEdhxuAErSyYwcTEGWQswFoi6FScnGG1RKSB"

export const getListingFilterPda = (admin: PublicKey, seed: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(LISTING_FILTER), admin.toBuffer(), seed.toBuffer()],
    new PublicKey(PROGRAM_ID_LISTINGS)
  );
};
