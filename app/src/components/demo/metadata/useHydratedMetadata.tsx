import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { IRpcObject } from "components/executor/IRpcObject";
import { getMetadataExtendedPda } from "pdas/getMetadataExtendedPda";
import { Group, useGroupsById } from "query/group";
import { useMetadataById } from "query/metadata";
import {
  MetadataExtended,
  useMetadataExtendedById,
} from "query/metadataExtended";
import { useEffect, useMemo } from "react";

export const useMetadataHydratedWithExtended = (metadataKeys: PublicKey[]) => {
  const { connection } = useConnection();
  const { data: metadataObjs, isFetching } = useMetadataById(
    metadataKeys,
    connection
  );

  const orderedMetadata = useMemo(
    () =>
      metadataObjs
        ? [...metadataObjs].sort((a, b) =>
            a.item.name.localeCompare(b.item.name)
          )
        : [],
    [metadataObjs]
  );

  const metadataExtendedKeys = useMemo(
    () =>
      orderedMetadata
        .filter((item) => item.item.mint)
        .map((item) => ({
          mint: item.item.mint,
          metadataExtendedKey: getMetadataExtendedPda(item.pubkey)[0],
        })),
    [orderedMetadata]
  );

  const { data: metadataExtendedObjs, isFetching: isFetchinExtended } =
    useMetadataExtendedById(
      metadataExtendedKeys.map((item) => item.metadataExtendedKey),
      connection
    );

  const metadataExtendedByMint = useMemo(() => {
    const metadataExtendedDict: {
      [key: string]: IRpcObject<MetadataExtended>;
    } = {};

    for (const metadataExtendedObj of metadataExtendedObjs ?? []) {
      metadataExtendedDict[metadataExtendedObj.pubkey.toBase58()] =
        metadataExtendedObj;
    }

    const _metadataExtendedByMint: {
      [key: string]: IRpcObject<MetadataExtended>;
    } = {};
    for (const metadataExtendedKey of metadataExtendedKeys) {
      _metadataExtendedByMint[metadataExtendedKey.mint.toBase58()] =
        metadataExtendedDict[
          metadataExtendedKey.metadataExtendedKey.toBase58()
        ];
    }
    return _metadataExtendedByMint;
  }, [metadataExtendedObjs, metadataExtendedKeys]);

  // get distinct groups

  const distinctGroupIds = useMemo(
    () => [
      ...new Set([...metadataExtendedObjs.map((item) => item.item.group)]),
    ],
    [metadataExtendedObjs]
  );

  const {data: groups} = useGroupsById(distinctGroupIds, connection);

  const groupsById = useMemo(() => {
    const _groupsById: { [key: string]: IRpcObject<Group> } = {};
    for( const group of groups) {
      _groupsById[group.pubkey.toBase58()] = group
    }
    return _groupsById
  }, [groups]);

  const hydrated = useMemo(
    () =>
      metadataObjs?.map((item) => ({
        metadata: item,
        extended: item.item.mint
          ? metadataExtendedByMint[item.item.mint.toBase58()]
          : undefined,
        group: groupsById[metadataExtendedByMint[item.item.mint.toBase58()]?.item.group.toBase58()]
      })) ?? [],
    [metadataObjs, metadataExtendedByMint, groupsById]
  );

  return { hydrated, isFetching: isFetching || isFetchinExtended };
};
