import { PublicKey } from "@solana/web3.js";
import React, { useEffect, useMemo } from "react";
import {
  IRpcObject,
  Listing,
  useTokenAccountsByOwner,
  useUserSolBalanceStore,
} from "shared-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { useFetchSingleAccount } from "shared-ui/src/sdk/query/singleAccountInfo";

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
    console.log({balance});
  },[balance])

  return useMemo(
    () =>
      listing.item.price.native
        ? listing.item.price.native.lamports <= (balance ?? 0)
          ? publicKey
          : undefined
        : listing.item.price.spl
        ? tokenAccounts.find(
            (item) =>
              item.item!.mint === listing.item.price.spl?.mint &&
              item.item!.amount >= listing.item.price.spl?.amount
          )?.pubkey
        : undefined,
    [tokenAccounts, listing]
  );
};
