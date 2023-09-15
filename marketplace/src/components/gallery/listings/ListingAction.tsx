import { HStack, Text } from "@chakra-ui/react";
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import {
  IRpcObject,
  useGroupById,
  useMetadataByMintId,
  useTokenAccountById,
} from  "@libreplex/shared-ui";
import { DelistTransactionButton } from "./DelistTransactionButton";
import { ExecuteTradeTransactionButton } from "./ExecuteTradeTransactionButton";
import { useTokenAccountsForPurchase } from "./useTokenAccountForPurchase";
import { Listing } from "./groups/GroupDisplay";

export const ListingAction = ({
  publicKey,
  listing,
}: {
  publicKey: PublicKey;
  listing: IRpcObject<Listing> & { executed?: boolean };
}) => {
  const buyerPaymentTokenAccount = useTokenAccountsForPurchase(
    publicKey,
    listing
  );

  const { connection } = useConnection();
  const metadata = useMetadataByMintId((listing.item as any).mint, connection);
  const group = useGroupById(metadata?.item?.group ?? null, connection);

  const solAmount = useMemo(
    () =>
      (Number((listing.item as any).price.native?.lamports ?? 0) / 10 ** 9).toFixed(4),
    [(listing.item as any).price.native?.lamports]
  );

  const tokenAccountId = useMemo(
    () =>
      getAssociatedTokenAddressSync(
        (listing.item as any).mint,
        listing.pubkey,
        true,
        TOKEN_2022_PROGRAM_ID
      ),
    [listing]
  );

  // for some reason delete / execute event listeners in useAllListings are not 
  // triggering - hence using the token account to figure out if a listing is active
  const tokenAccount = useTokenAccountById(tokenAccountId, connection);

  return (
    <HStack>
      <Text sx={{ position: "absolute", top: 2, right: 2 }}>
        {solAmount} SOL 
      </Text>

      {tokenAccount?.amount === BigInt(0) ? (
        <Text>Inactive</Text>
      ) : listing.deleted ? ( // this is currently not firing, see above
        <Text>Delisted</Text>
      ) : listing?.executed ? ( // this is currently not firing, see above
        <Text>Sold</Text>
      ) : (listing.item as any).lister.equals(publicKey) ? (
        <DelistTransactionButton
          params={{
            listing,
          }}
          formatting={{}}
        />
      ) : buyerPaymentTokenAccount && metadata?.item ? (
        <ExecuteTradeTransactionButton
          params={{
            listing: { ...listing, item: listing.item! },
            mint: (listing.item as any)?.mint!,
            group,
            metadata,
            buyerPaymentTokenAccount: buyerPaymentTokenAccount ?? null,
            amount: BigInt((listing.item as any)!.amount.toString()),
          }}
          formatting={{}}
        />
      ) : (
        <Text>Insufficient funds</Text>
      )}
    </HStack>
  );
};
