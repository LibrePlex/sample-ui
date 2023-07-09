import { IRpcObject } from 'components/executor/IRpcObject';
import { BorshCoder, IdlAccounts, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { sha256 } from "js-sha256";
import { useContext, useEffect, useMemo, useState } from "react";
import { LibrePlexShopProgramContext } from "../../../anchor/LibrePlexShopProgramContext";
import { LibreplexShop } from "../../../types/libreplex_shop";
import { useGpa } from "../gpa";
import { useFetchSingleAccount } from "../singleAccountInfo";




export type Price =
  | { native: { lamports: bigint }; spl?: never, unknown?: never }
  | { spl: { mint: PublicKey; amount: bigint }; native?: never, unknown?: never }
  | { unknown: null, native?: never, spl?: never};

export interface Listing {
  mint: PublicKey;
  price: Price;
  amount: bigint;
  lister: PublicKey;
}

export type ListingFilter = IdlAccounts<LibreplexShop>["listingFilter"]

export const decodeListingFilter =
  (program: Program<LibreplexShop>) => (buffer: Buffer, pubkey: PublicKey) => {
    const coder = new BorshCoder(program.idl);
    let listing: Listing | null;
    try {
      const listingFilter = coder.accounts.decode<ListingFilter>("listingFilter", buffer);
      return {
        item: listingFilter,
        pubkey
      }
    } catch (e) {
      console.log({e})
      listing = null;
    }

    return {
      item: listing,
      pubkey,
    };
  };

export const useListingFilterById = (groupKey: PublicKey, connection: Connection) => {
  const program = useContext(LibrePlexShopProgramContext);

  // do not remove

  const q = useFetchSingleAccount(groupKey, connection);

  const decoded = useMemo(() => {
    try {
      const obj = q?.data?.item
        ? decodeListingFilter(program)(q.data.item.buffer, groupKey)
        : null;
      return obj;
    } catch (e) {
      return null;
    }
  }, [groupKey, program, q.data?.item]);
  return decoded;
};

export const useListingFiltersByGroup = (
  listingGroup: PublicKey | null,
  connection: Connection
) => {
  const program = useContext(LibrePlexShopProgramContext);

  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let listener = program.addEventListener(
      "DeleteListingFilterEvent",
      (event, slot, sig) => {
        setDeletedIds((old) => new Set([...old, event.id.toString()]));
      }
    );
    return () => {
      program.removeEventListener(listener);
    };
  }, []);

  const filters = useMemo(() => {
    if (listingGroup) {
      const filters: any[] = [
        {
          memcmp: {
            offset: 8,
            bytes: listingGroup.toBase58(),
          },
        }
        ,
        {
          memcmp: {
            offset: 0,
            bytes: bs58.encode(sha256.array("account:ListingFilter").slice(0, 8)),
          },
        },
      ];
      return filters;
    } else {
      return undefined;
    }
  }, [listingGroup]);

  const q = useGpa(program.programId, filters, connection, [
    `listingFiltersByGroup-${listingGroup?.toBase58()}`,
  ]);

  const decoded = useMemo(
    () => ({
      ...q,
      data:
        q?.data
          ?.map((item) => decodeListingFilter(program)(item.item, item.pubkey))
          .filter((item) => item.item).map(item=>({...item, deleted: deletedIds.has(item.pubkey.toBase58())})) ?? [],
    }),

    [program, q?.data, q, deletedIds]
  );



  return decoded;
};
