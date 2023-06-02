import { useMemo } from "react"
import {PublicKey} from "@solana/web3.js";

export const usePublicKeyOrNull = (pubkey: string) => {

    const publicKey = useMemo(()=>{
        try {
            return new PublicKey(pubkey)
        }catch (e) {
            return null;
        }   

    },[pubkey])

    return publicKey

}