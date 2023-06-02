import { Connection, PublicKey } from "@solana/web3.js";
import { IRpcObject } from "components/executor/IRpcObject";
import { Collection, CollectionPermissions } from "generated/libreplex";
import { useEffect, useMemo } from "react";
import {
  BaseRpcGpaStore,
  useGenericMultiAccountInfoStore,
} from "stores/useGenericMultiAccountInfoStore";

export const decodeCollection = (buffer: Buffer) => {
  const obj = Collection.deserialize(buffer);
  if (obj) {
    return obj[0];
  } else {
    return null;
  }
};

export const collectionsMultiAccountStore =
  useGenericMultiAccountInfoStore(decodeCollection);

export const useCollectionsByKey = (
  collectionPublicKeys: PublicKey[],
  connection: Connection
) => {
  const store = collectionsMultiAccountStore();

  const { fetch, items, isFetching } = store;

  /// intercept and refresh as needed
  useEffect(() => {
    if (!isFetching && !items ) {
      fetch(collectionPublicKeys, connection);
    }
  }, [isFetching, fetch, collectionPublicKeys, items, connection]);

  return store;
};

export const usePermissionsHydratedWithCollections = (
  permissions: IRpcObject<CollectionPermissions>[] | null,
  connection: Connection
) => {
  const store = collectionsMultiAccountStore();

  

  const { fetch, removeItem, items: collections, isFetching } = store;

  useEffect(()=>{
    console.log({permissions, collections})
  },[permissions, collections])

  const permissionsByCollection = useMemo(() => {
    const _permissionsByCollection: {
      [key: string]: IRpcObject<CollectionPermissions>;
    } = {};

    for (const permission of permissions ?? []) {
      _permissionsByCollection[permission.item.collection.toBase58()] = {
        pubkey: permission.pubkey,
        item: permission.item,
      };
    }

    return _permissionsByCollection;
  }, [permissions]);

  const distinctCollectionKeys = useMemo(
    () => [
      ...new Set<PublicKey>(
        permissions
          ?.filter((item) => item.item)
          .map((item) => item.item.collection) ?? []
      ),
    ],
    [permissions]
  );

  useEffect(() => {
    if (!isFetching && !collections) {
      fetch(distinctCollectionKeys, connection);
    }
  }, [isFetching, distinctCollectionKeys, connection, collections]);

  useEffect(()=>{
    console.log({collections, permissionsByCollection})
  },[collections, permissionsByCollection])
  
  const combined = useMemo(() => {
    const _combined: {
      collection: IRpcObject<Collection>;
      permissions: IRpcObject<CollectionPermissions>;
    }[] = [];
    for (const collection of collections ?? []) {
      _combined.push({
        collection,
        permissions:
          permissionsByCollection[collection.pubkey.toBase58()] ?? null,
      });
    }

    return _combined;
  }, [collections, permissionsByCollection]);

  return { ...store, items: combined, removeCollection: removeItem };
};
