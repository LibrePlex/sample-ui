import { QueryClient, useQuery, useQueryClient } from "react-query";
import { BorshCoder, IdlAccounts, IdlTypes, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { sha256 } from "js-sha256";
import { useContext, useEffect, useMemo, useState } from "react";
import { LibrePlexShopProgramContext } from "../../../anchor/LibrePlexShopProgramContext";
import { LibreplexShop } from "../../../types/libreplex_shop";
import { useGpa } from "../gpa";
import { useFetchSingleAccount } from "../singleAccountInfo";
import { IRpcObject } from "../../../components";
import { useDeletedKeyStore } from "../../../stores";

// export interface ListingGroup {
//   admin: PublicKey,
//   seed: PublicKey,
//   name: string,
//   listingsActive: number,
//   listingsCreated: number,
//   listingsSold: number,
//   filterCount: number,
// }

export type ListingGroup = IdlAccounts<LibreplexShop>["listingGroup"];

export type ListingFilterType = IdlTypes<LibreplexShop>["ListingFilterType"];

export const decodeListingGroup =
  (program: Program<LibreplexShop>) => (buffer: Buffer, pubkey: PublicKey) => {
    const coder = new BorshCoder(program.idl);
    let listing: ListingGroup | null;
    try {
      listing = coder.accounts.decode<
        IdlAccounts<LibreplexShop>["listingGroup"]
      >("listingGroup", buffer);
    } catch (e) {
      console.log({ e });
      listing = null;
    }

    const retval: IRpcObject<ListingGroup|null> ={
      item: listing,
      pubkey,
    };

    return retval;
  };

export const useListingGroupById = (
  groupKey: PublicKey,
  connection: Connection
) => {
  const program = useContext(LibrePlexShopProgramContext);

  // do not remove

  const q = useFetchSingleAccount(groupKey, connection);

  const decoded = useMemo(() => {
    try {
      const obj = q?.data?.item
        ? decodeListingGroup(program)(q.data.item.buffer, groupKey)
        : null;
      return obj;
    } catch (e) {
      return null;
    }
  }, [groupKey, program, q.data?.item]);
  return decoded;
};

const KEY = "listingGroupsByAdmin";

export const useListingGroupsByAdmin = (
  admin: PublicKey | null,
  connection: Connection
) => {
  const program = useContext(LibrePlexShopProgramContext);

  const filters = useMemo(() => {
    if (admin) {
      const filters: any[] = [
        {
          memcmp: {
            offset: 8,
            bytes: admin.toBase58(),
          },
        },
        {
          memcmp: {
            offset: 0,
            bytes: bs58.encode(
              sha256.array("account:ListingGroup").slice(0, 8)
            ),
          },
        },
      ];
      return filters;
    } else {
      return undefined;
    }
  }, [admin]);

  const q = useGpa(program.programId, filters, connection, [KEY]);
  
  const { addDeletedKey, deletedKeys } = useDeletedKeyStore();

  // const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let listener = program.addEventListener(
      "DeleteListingGroupEvent",
      (event, slot, sig) => {
        console.log({event, id: event.id});
        addDeletedKey(event.id);
      }
    );
    return () => {
      program.removeEventListener(listener);
    };
  }, []);

  const decoded = useMemo(
    () => ({
      ...q,
      data:
        q?.data
          ?.map((item) => decodeListingGroup(program)(item.item, item.pubkey))
          .filter((item) => item.item).map(item=>({...item, deleted: deletedKeys.has(item.pubkey)})) ?? [],
    }),

    [program, q?.data, q, deletedKeys]
  );

  // useEffect(() => {
  //   console.log({ q, decoded, deletedKeys });
  // }, [q, decoded, deletedKeys]);

  return decoded;
};
