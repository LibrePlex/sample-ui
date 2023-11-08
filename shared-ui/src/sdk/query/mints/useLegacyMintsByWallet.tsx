import { RawAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { IRpcObject } from "../../../components";
import { useEffect, useMemo } from "react";
import { getLegacyMetadataPda } from "../../../pdas";
import { useMultipleAccountsById } from "../metadata/useMultipleAccountsById";
import { useTokenAccountsByOwner } from "../tokenaccountsbyowner";

export type MintWithTokenAccount = {
  mint: PublicKey;
  tokenAccount: IRpcObject<RawAccount>;
}

export const useLegacyMintsByWallet = (
  owner: PublicKey,
  connection: Connection
) => {
  const { data: ownedMints, isFetching: isFetchingMints } =
    useTokenAccountsByOwner(owner, connection, TOKEN_PROGRAM_ID);

  const tokenAccountByMint = useMemo(() => {
    const _tokenAccountByMint: {
      [mintId: string]: IRpcObject<RawAccount | null>;
    } = {};
    for (const ta of ownedMints) {
      if (ta.item?.mint.toBase58()) {
        _tokenAccountByMint[ta.item?.mint.toBase58()] = ta;
      }
    }
    return _tokenAccountByMint;
  }, [ownedMints]);

  const legacyMetadataIds = useMemo(
    () =>
      ownedMints
        .filter((item) => item.item?.mint!)
        .map((item) => ({
          mint: item.item!.mint,
          metadata: getLegacyMetadataPda(item.item!.mint!)[0],
        })),
    [ownedMints]
  );

  // const { data: metadata, isFetching: isFetchingMetadata } =
  //   useMultipleAccountsById(
  //     legacyMetadataIds.map((item) => item.metadata),
  //     connection
  //   );

  // /

  const combined = useMemo(() => {
    const _combined: MintWithTokenAccount[] = [];

    for (const o of legacyMetadataIds) {
      _combined.push({
        mint: o.mint,
        tokenAccount: tokenAccountByMint[o.mint.toBase58()],
      });
    }
    return _combined;
  }, [tokenAccountByMint, legacyMetadataIds]);


  return {
    data: combined,
    isFetching: isFetchingMints
  };
};
