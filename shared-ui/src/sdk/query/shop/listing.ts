import { LibreplexShop } from '@libreplex/idls/lib/cjs/libreplex_shop';
import { BorshCoder, IdlAccounts, IdlTypes, Program } from "@coral-xyz/anchor";
import {
  Connection,
  PublicKey,
  GetProgramAccountsFilter,
} from "@solana/web3.js";
import bs58 from "bs58";
import { sha256 } from "js-sha256";
import { useContext, useEffect, useMemo, useState } from "react";
import { LibrePlexShopProgramContext } from "../../../anchor/shop/LibrePlexShopProgramContext";

import { useGpa } from "../gpa";
import { useFetchSingleAccount } from "../singleAccountInfo";

// export type Price =
//   | { native: { lamports: bigint }; spl?: never, unknown?: never }
//   | { spl: { mint: PublicKey; amount: bigint }; native?: never, unknown?: never }
//   | { unknown: null, native?: never, spl?: never};

// export interface Listing {
//   mint: PublicKey;
//   price: Price;
//   amount: bigint;
//   lister: PublicKey;
// }

export type Listing = IdlAccounts<LibreplexShop>["listing"];

export type Price = IdlTypes<LibreplexShop>["Price"];

export const decodeListing =
  (program: Program<LibreplexShop>) => (buffer: Buffer, pubkey: PublicKey) => {
    const coder = new BorshCoder(program.idl);
    let listing: Listing | null;
    try {
      listing = coder.accounts.decode<Listing>("listing", buffer);
      // listing = {
      //     ...listingRaw,
      //     amount: BigInt(listingRaw.amount.toString()),
      //     lister: listingRaw.lister,
      //     price: listingRaw?.price.native? {
      //       native: {
      //         lamports: BigInt(listingRaw.price.native.lamports.toString())
      //       }
      //     } : listingRaw?.price.spl?{
      //       spl: {
      //         mint: listingRaw?.price.spl.mint,
      //         amount: BigInt(listingRaw?.price.spl.amount.toString()),
      //       }
      //     } : {
      //       unknown: null
      //     }
      // };
    } catch (e) {
      console.log({ e });
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
        ? decodeListing(program)(q.data.item.buffer, groupKey)
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
      const filters: any[] = [
        {
          memcmp: {
            offset: 40,
            bytes: lister.toBase58(),
          },
        },
        {
          memcmp: {
            offset: 0,
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
    "listingsByLister",
  ]);

  useEffect(() => {
    console.log({ q });
  }, [q]);

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

// use with caution
export const useAllListings = (connection: Connection) => {
  const program = useContext(LibrePlexShopProgramContext);

  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [executedIds, setExecutedIds] = useState<Set<string>>(new Set());

  const filters = useMemo(() => {
    const filters: any[] = [
      {
        memcmp: {
          offset: 0,
          bytes: bs58.encode(sha256.array("account:Listing").slice(0, 8)),
        },
      },
    ];
    return filters;
  }, [program]);

  useEffect(() => {
    
    let listener = program.addEventListener(
      "DelistEvent",
      (event, slot, sig) => {
        setDeletedIds((old) => new Set([...old, event.id.toString()]));
      }
    );
    return () => {
      program.removeEventListener(listener);
    };
  }, [program]);

  useEffect(() => {
    let listener = program.addEventListener(
      "ExecuteEvent",
      (event, slot, sig) => {
        console.log('Executed', event);
        setExecutedIds((old) => new Set([...old, event.id.toString()]));
      }
    );
    return () => {
      program.removeEventListener(listener);
    };
  }, [program]);

  const q = useGpa(program.programId, filters, connection, [`allListings`]);

  const decoded = useMemo(
    () => ({
      ...q,
      data:
        (
          q?.data
            ?.map((item) => decodeListing(program)(item.item, item.pubkey))
            .filter((item) => item.item) ?? []
        ).map((item) => ({
          ...item,
          deleted: deletedIds.has(item.pubkey.toBase58()),
          executed: executedIds.has(item.pubkey.toBase58())
        })) ?? [],
    }),

    [program, q, deletedIds, executedIds]
  );

  return decoded;
};

export const useListingsByGroup = (
  group: PublicKey | null | undefined,
  connection: Connection
) => {
  const program = useContext(LibrePlexShopProgramContext);

  const filters = useMemo(() => {
    if (group) {
      const filters: GetProgramAccountsFilter[] = [
        {
          memcmp: {
            offset: 8 + 32 + 32 + 8 + 1,
            bytes: group.toBase58(),
          },
        },
        {
          memcmp: {
            offset: 0,
            bytes: bs58.encode(sha256.array("account:Listing").slice(0, 8)),
          },
        },
      ];
      return filters;
    } else {
      return undefined;
    }
  }, [group]);

  const q = useGpa(program.programId, filters, connection, [
    `listingsByGroup-${group?.toBase58()}`,
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

  console.log({ t: "listings", decoded, q, group: group?.toBase58() });

  return decoded;
};
