import { PublicKey } from "@solana/web3.js";
import React, { useEffect, useMemo } from "react";
import {
  IRpcObject,
  useTokenAccountsByOwner,
} from  "@libreplex/shared-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { useFetchSingleAccount } from "shared-ui/src/sdk/query/singleAccountInfo";
import { IdlAccounts } from "@coral-xyz/anchor";
import { LibreplexShop } from "@libreplex/idls/lib/types/libreplex_shop";

type Listing = IdlAccounts<LibreplexShop>["listing"]

export const useTokenAccountsForPurchase = (
  publicKey: PublicKey,
  listing: IRpcObject<Listing>
) => {
  const { connection } = useConnection();
  const { data: tokenAccounts } = useTokenAccountsByOwner(
    publicKey,
    connection,
    TOKEN_2022_PROGRAM_ID
  );

  const {data} = useFetchSingleAccount(publicKey, connection);

  const balance = useMemo(()=>data?.item?.balance,[data])

  useEffect(()=>{
    console.log({balance, publicKey: publicKey.toBase58()});
  },[balance, publicKey])

  return useMemo(
    () =>
      (listing.item as any).price.native
        ? BigInt((listing.item as any).price.native.lamports.toString()) <= (balance ?? 0)
          ? publicKey
          : undefined
        : (listing.item as any).price.spl
        ? tokenAccounts.find(
            (item) =>
              item.item!.mint === (listing.item as any).price.spl?.mint &&
              BigInt(item.item!.amount.toString()) >= BigInt((listing.item as any).price.spl?.amount.toString()??"0")
          )?.pubkey
        : undefined,
    [tokenAccounts, listing]
  );
};
