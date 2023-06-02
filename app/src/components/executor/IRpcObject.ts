import { PublicKey } from "@solana/web3.js";

export interface IRpcObject<T> {
    pubkey: PublicKey,
    item: T
}