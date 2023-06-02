import { PublicKey } from "@solana/web3.js";

export interface IRoyaltyShare {
    share: number,
    recipient: PublicKey
}