import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { Connection, PublicKey } from "@solana/web3.js";
import { IRpcObject } from "components/executor/IRpcObject";
import {
  Collection,
  CollectionPermissions,
  PROGRAM_ID,
} from "generated/libreplex";
import { sha256 } from "js-sha256";
import create, { State } from "zustand";

export interface ICollectionPermissions {
  collection: PublicKey;
  user: PublicKey;

  isAdmin: boolean;

  canCreateMetadata: boolean;
  canEditMetadata: boolean;
  canDeleteMetadata: boolean;

  canEditCollection: boolean;
  canDeleteCollection: boolean;
}

export const decodeCollection = (buffer: Buffer, pubkey: string) => {
  return { pubkey, item: { pubkey: new PublicKey(buffer.slice(8, 40)) } };
};

interface CollectionsByAuthorityStore extends State {
  clearCollections: () => any;
  collections:
    | {
        collection: IRpcObject<Collection>;
        permissions: IRpcObject<CollectionPermissions> | null;
      }[]
    | null;

  isFetching: boolean;
  getCollectionsByAuthority: (
    publicKey: PublicKey,
    connection: Connection
  ) => void;
}

const decodeCollectionPermission = (
  buffer: Buffer
): CollectionPermissions | null => {
  const collectionPermission = CollectionPermissions.deserialize(buffer);
  return collectionPermission[0] ?? null;
};

const useCollectionsByAuthority = create<CollectionsByAuthorityStore>(
  (set, _get) => ({
    isFetching: false,
    collections: null,
    interval: null,
    clearCollections: () => {
      set((s) => {
        s.collections = null;
      });
    },
    getCollectionsByAuthority: async (publicKey, connection) => {
      if (publicKey && connection) {
        set((s) => {
          s.isFetching = true;
        });
        let collectionPermissions: IRpcObject<CollectionPermissions>[] = [];
        let collections: {
          collection: IRpcObject<Collection>;
          permissions: IRpcObject<CollectionPermissions> | null;
        }[] = [];

        const filters = [
          {
            memcmp: {
              offset: 0,
              bytes: bs58.encode(
                sha256.array("account:CollectionPermissions").slice(0, 8)
              ),
            },
          },
        ];

        // gpaBuilderPermissions.addFilter("user", publicKey);

        try {
          const results = await connection.getProgramAccounts(PROGRAM_ID, {
            filters,
          });

          const permissionsByCollection: {
            [key: string]: { pubkey: PublicKey; item: CollectionPermissions };
          } = {};

          for (const result of results.values()) {
            const collectionPermission = decodeCollectionPermission(
              result.account.data
            );

            collectionPermissions.push({
              pubkey: result.pubkey,
              item: collectionPermission,
            });

            permissionsByCollection[
              collectionPermission.collection.toBase58()
            ] = {
              pubkey: result.pubkey,
              item: collectionPermission,
            };
          }

          console.log({ collectionPermissions });

          // we can now fetch the collections that the authority owns at least one permission over

          const distinctCollectionKeys = [
            ...new Set<PublicKey>(
              collectionPermissions
                .filter((item) => item.item)
                .map((item) => item.item.collection)
            ),
          ];

          const collectionBuffers = await connection.getMultipleAccountsInfo(
            distinctCollectionKeys
          );

          console.log({ collectionBuffers });

          for (const [idx, collectionBuffer] of collectionBuffers.entries()) {
            if (collectionBuffer?.data) {
              const collection = Collection.deserialize(collectionBuffer.data);
              if (collection) {
                const pubkey = distinctCollectionKeys[idx];
                collections.push({
                  collection: {
                    pubkey,
                    item: collection[0],
                  },
                  permissions:
                    permissionsByCollection[pubkey.toBase58()] ?? null,
                });
              }
            }
          }
          console.log({ collections });
        } catch (e) {
          console.log(`error fetching collections: `, e);
        }
        set((s) => {
          s.collections = collections;
          s.isFetching = false;
          // console.log(`balance updated, `, balance);
        });
      }
    },
  })
);

export default useCollectionsByAuthority;
