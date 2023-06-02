import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { sha256 } from "js-sha256";
import { Connection, PublicKey } from "@solana/web3.js";
import { CollectionPermissions, PROGRAM_ID } from "generated/libreplex";
import { useEffect } from "react";
import { useGenericGpaStore } from "stores/useGenericRpcStore";


const decodeCollectionPermission = (
  buffer: Buffer
): CollectionPermissions | null => {
  const collectionPermission = CollectionPermissions.deserialize(buffer);
  return collectionPermission[0] ?? null;
};

export const permissionsStore = useGenericGpaStore(
  PROGRAM_ID,
  decodeCollectionPermission
);

export const usePermissionsByAuthority = (
  publicKey: PublicKey | null,
  connection: Connection
) => {
  const store = permissionsStore();

  const {
    fetch: fetchPermissions,
    items: permissions,
    isFetching: fetchingPermissions,
  } = store;

  useEffect(() => {
    console.log({fetchingPermissions, permissions,  publicKey})
    if (!fetchingPermissions && !permissions && publicKey) {
      const gpaBuilder = CollectionPermissions.gpaBuilder();
      console.log({publicKey})
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

      fetchPermissions(filters, connection);
    }
  }, [publicKey, fetchingPermissions, permissions]);

  return store;
};
