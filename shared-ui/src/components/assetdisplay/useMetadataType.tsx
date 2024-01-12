import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { useMint } from "../../sdk";
import { Field, TokenMetadata } from "@solana/spl-token-metadata";
import { Mint } from "@solana/spl-token";
import e from "express";
export enum MetadataType {
    Token2022 = 'Token2022',
    Metaplex = 'Metaplex'
}
export const useMetadataTypeForMint = (mint: PublicKey) => {
  const { connection } = useConnection();
  const mintOrToken2022Mint = useMint(mint, connection);

  return useMemo(() => {
    let nativeMetadata = (
      mintOrToken2022Mint?.item as Mint & { metadata?: TokenMetadata }
    )?.metadata;
    if( nativeMetadata ) {
        return MetadataType.Token2022
    } else {
        return MetadataType.Metaplex
    }
  }, [mintOrToken2022Mint]);
};
