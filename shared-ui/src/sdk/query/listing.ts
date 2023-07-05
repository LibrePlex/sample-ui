import { BorshCoder, IdlAccounts, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { sha256 } from "js-sha256";
import { useContext, useMemo } from "react";
import { LibrePlexShopProgramContext } from "../../anchor/LibrePlexShopProgramContext";
import { LibreplexShop } from "../../types/libreplex_shop";
import { useGpa } from "./gpa";
import { useFetchSingleAccount } from "./singleAccountInfo";



export type Price =
  | { native: { lamports: BigInt }; spl?: never, unknown?: never }
  | { spl: { mint: PublicKey; amount: BigInt }; native?: never, unknown?: never }
  | { unknown: null, native?: never, spl?: never};

export interface Listing {
  mint: PublicKey;
  price: Price;
  amount: BigInt;
}

export const decodeListing =
  (program: Program<LibreplexShop>) => (buffer: Buffer, pubkey: PublicKey) => {
    const coder = new BorshCoder(program.idl);
    let listing: Listing | null;
    try {
      const listingRaw = coder.accounts.decode<IdlAccounts<LibreplexShop>["listing"]>("group", buffer);
      listing = {
          ...listingRaw,
          amount: BigInt(listingRaw.amount.toString()),
          price: listingRaw?.price.native? {
            native: {
              lamports: BigInt(listingRaw.price.native.lamports.toString())
            }
          } : listingRaw?.price.spl?{
            spl: {
              mint: listingRaw?.price.spl.mint,
              amount: BigInt(listingRaw?.price.spl.amount.toString()),
            }
          } : {
            unknown: null
          }
      };
    } catch (e) {
      listing = null;
    }

    return {
      item: listing,
      pubkey,
    };
  };

export const useListingById = (groupKey: PublicKey, connection: Connection) => {
  const program = useContext(LibrePlexShopProgramContext);

  // do not remove

  const q = useFetchSingleAccount(groupKey, connection);

  const decoded = useMemo(() => {
    try {
      const obj = q?.data?.item
        ? decodeListing(program)(q.data.item, groupKey)
        : null;
      return obj;
    } catch (e) {
      return null;
    }
  }, [groupKey, program, q.data?.item]);
  return decoded;
};

export const useListingsByLister = (
  lister: PublicKey | null,
  connection: Connection
) => {
  const program = useContext(LibrePlexShopProgramContext);

  const filters = useMemo(() => {
    if (lister) {
      const filters = [
        {
          memcmp: {
            offset: 40,
            bytes: lister.toBase58(),
          },
        },
        {
          memcmp: {
            offset: 40,
            bytes: bs58.encode(sha256.array("account:Listing").slice(0, 8)),
          },
        },
      ];
      return filters;
    } else {
      return undefined;
    }
  }, [lister]);

  const q = useGpa(program.programId, filters, connection, [
    lister?.toBase58() ?? "",
    "listingsByLister",
  ]);

  const decoded = useMemo(
    () => ({
      ...q,
      data:
        q?.data
          ?.map((item) => decodeListing(program)(item.item, item.pubkey))
          .filter((item) => item.item) ?? [],
    }),

    [program, q]
  );

  return decoded;
};
