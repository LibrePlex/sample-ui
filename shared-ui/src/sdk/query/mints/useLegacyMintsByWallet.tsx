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


  const combined = useMemo(() => {
    const _combined: MintWithTokenAccount[] = [];

    for (const o of ownedMints) {
      _combined.push({
        mint: o.item.mint,
        tokenAccount: tokenAccountByMint[o.item.mint.toBase58()],
      });
    }
    return _combined;
  }, [tokenAccountByMint, ownedMints]);


  return {
    data: combined,
    isFetching: isFetchingMints
  };
};
