import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { IRpcObject } from "components/executor/IRpcObject";
import { useGroupsById } from "query/group";
import { usePermissionsByUser } from "query/permissions";
import { Permissions } from "query/permissions";
import { useMemo } from "react";

export const usePermittedCollections = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const { data: permissions, refetch } = usePermissionsByUser(
    publicKey,
    connection
  );

  //   const { data: createdCollections } = useCollectionsByCreator(
  //     publicKey,
  //     connection
  //   );

  const distinctGroupKeys = useMemo(
    () => [
      ...new Set<PublicKey>([
        ...(permissions
          ?.filter((item) => item.item)
          .map((item) => item.item.reference) ?? []),
        // ...(createdCollections?.map((item) => item.pubkey) ?? []),
      ]),
    ],
    [
      permissions,
      // , createdCollections
    ]
  );

  const permissionsByCollection = useMemo(() => {
    const _permissionsByCollection: {
      [key: string]: IRpcObject<Permissions>;
    } = {};

    for (const permission of permissions ?? []) {
      if (permission.item.reference) {
        _permissionsByCollection[permission.item.reference.toBase58()] = {
          pubkey: permission.pubkey,
          item: permission.item,
        };
      }
    }
    return _permissionsByCollection;
  }, [permissions]);

  const { data: groups, isFetching } = useGroupsById(
    distinctGroupKeys,
    connection
  );

  return { groups, permissionsByCollection, refetch };
};
