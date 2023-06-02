import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import {
  Connection,
  ProgramAccountChangeCallback,
  PublicKey,
} from "@solana/web3.js";
import { CollectionPermissions, PROGRAM_ID } from "generated/libreplex";
import { sha256 } from "js-sha256";
import { fetchGpa, useGpa } from "query/gpa";
import { useMemo } from "react";

export const decodeCollectionPermission = (
  buffer: Buffer
): CollectionPermissions | null => {
  const collectionPermission = CollectionPermissions.deserialize(buffer);
  return collectionPermission[0] ?? null;
};

export const usePermissions = (
  publicKey: PublicKey | undefined,
  connection: Connection
) => {
  const filters = useMemo(() => {
    if (publicKey) {
      const gpaBuilder = CollectionPermissions.gpaBuilder();
      const userFilter = gpaBuilder.addFilter("user", publicKey).config.filters;

      const filters = [
        ...userFilter,
        {
          memcmp: {
            offset: 0,
            bytes: bs58.encode(
              sha256.array("account:CollectionPermissions").slice(0, 8)
            ),
          },
        },
      ];
      return filters;
    } else {
      return null;
    }
  }, [publicKey]);

  return useGpa(PROGRAM_ID, filters, connection, decodeCollectionPermission, [
    publicKey?.toBase58() ?? '',
    "collectionpermissions",
  ]);
};
