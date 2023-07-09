import { PublicKey } from '@solana/web3.js';

const LISTING_GROUP = "listing_group";
export const PROGRAM_ID_LISTINGS =
  "ListjawGEdhxuAErSyYwcTEGWQswFoi6FScnGG1RKSB"

export const getListingGroupPda = (admin: PublicKey, seed: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(LISTING_GROUP), admin.toBuffer(), seed.toBuffer()],
    new PublicKey(PROGRAM_ID_LISTINGS)
  );
};
