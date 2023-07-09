import { PublicKey } from "@solana/web3.js";
import React, { useMemo } from "react";
import {
  IRpcObject,
  Listing,
  useGroupById,
  useTokenAccountsByOwner,
} from "shared-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { useTokenAccountsForPurchase } from "./useTokenAccountForPurchase";
import { ExecuteTradeTransactionButton } from "./ExecuteTradeTransactionButton";
import { HStack, Text } from "@chakra-ui/react";
import { useMetadataByMintId } from "shared-ui";
import { DelistTransactionButton } from "./DelistTransactionButton";

export const ListingAction = ({
  publicKey,
  listing,
}: {
  publicKey: PublicKey;
  listing: IRpcObject<Listing>;
}) => {
  const buyerPaymentTokenAccount = useTokenAccountsForPurchase(
    publicKey,
    listing
  );

  const { connection } = useConnection();
  const metadata = useMetadataByMintId(listing.item.mint, connection);
  const group = useGroupById(metadata?.item?.group ?? null, connection);

  const solAmount = useMemo(()=>
    (Number(listing.item.price.native?.lamports??0) / (10**9)).toFixed(4)
  ,[listing.item.price.native?.lamports])

  return (
    <HStack >
      <Text sx={{position: 'absolute', top: 2, right: 2}}>{solAmount} SOL</Text>
      {buyerPaymentTokenAccount && metadata?.item ? (
        <ExecuteTradeTransactionButton
          params={{
            listing: { ...listing, item: listing.item! },
            mint: listing.item?.mint!,
            group,
            metadata,
            buyerPaymentTokenAccount: buyerPaymentTokenAccount ?? null,
            amount: BigInt(listing.item!.amount.toString()),
          }}
          formatting={{}}
        />
      ) : (
        <Text>Insufficient funds</Text>
      )}
      {listing.item.lister.equals(publicKey) && (
        <DelistTransactionButton
          params={{
            listing,
          }}
          formatting={{}}
        />
      )}
    </HStack>
  );
};
