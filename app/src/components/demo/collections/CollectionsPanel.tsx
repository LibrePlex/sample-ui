import { RepeatIcon, AttachmentIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Checkbox,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { CopyPublicKeyButton } from "components/buttons/CopyPublicKeyButton";
// import {
//     usePermissionsHydratedWithCollections
// } from "stores/accounts/useCollectionsById";
import { PublicKey } from "@solana/web3.js";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DeleteCollectionTransactionButton } from "./DeleteCollectionButton";

import { IRpcObject } from "components/executor/IRpcObject";
import {
  Collection,
  decodeCollection,
  useCollectionsByCreator,
  useCollectionsById,
} from "query/collections";
import { CollectionPermissions, usePermissionsByUser } from "query/permissions";
import useSelectedCollections from "./useSelectedCollections";
import { CollectionRow } from "./CollectionRow";
import { EditCollectionDialog } from "./editCollectionDialog/EditCollectionDialog";

export const CollectionsPanel = () => {
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

  const distinctCollectionKeys = useMemo(
    () => [
      ...new Set<PublicKey>([
        ...(permissions
          ?.filter((item) => item.item)
          .map((item) => item.item.collection) ?? []),
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
      [key: string]: IRpcObject<CollectionPermissions>;
    } = {};

    for (const permission of permissions ?? []) {
      if (permission.item.collection) {
        _permissionsByCollection[permission.item.collection.toBase58()] = {
          pubkey: permission.pubkey,
          item: permission.item,
        };
      }
    }
    return _permissionsByCollection;
  }, [permissions]);

  const { data: collections, isFetching } = useCollectionsById(
    distinctCollectionKeys,
    connection
  );

  const orderedCollections = useMemo(
    () =>
      collections
        ? [...collections].sort((a, b) =>
            a.item.name.localeCompare(b.item.name)
          )
        : [],
    [collections]
  );

  const selectedCollectionKeys = useSelectedCollections(
    (state) => state.selectedCollectionKeys
  );
  const toggleSelectedCollection = useSelectedCollections(
    (state) => state.toggleSelectedCollection
  );

  const setSelectedCollectionKeys = useSelectedCollections(
    (state) => state.setSelectedCollectionKeys
  );

  const [selectAll, setSelectAll] = useState<boolean>(false);

  const toggleSelectAll = useCallback(
    (_selectAll: boolean) => {
      setSelectedCollectionKeys(
        new Set(_selectAll ? collections.map((item) => item.pubkey) : [])
      );
      setSelectAll(_selectAll);
    },
    [collections]
  );

  const collectionDict = useMemo(() => {
    const _collectionDict: {
      [key: string]: ReturnType<ReturnType<typeof decodeCollection>>;
    } = {};

    for (const collection of collections ?? []) {
      if (collection) {
        _collectionDict[collection?.pubkey?.toBase58()] = collection;
      }
    }
    return _collectionDict;
  }, [collections]);
  const [editorStatus, setEditorStatus] = useState<{
    open: boolean;
    collection: Collection | undefined;
  }>({
    open: false,
    collection: undefined,
  });

  const deleteCollectionParams = useMemo(() => {
    return selectedCollectionKeys
      ? [...selectedCollectionKeys]
          .filter((item) => collectionDict[item.toBase58()])
          .map((pubkey) => ({
            creator: collectionDict[pubkey.toBase58()].item.creator,
            collectionPermissions:
              permissionsByCollection[pubkey.toBase58()].pubkey,
            collection: pubkey,
          }))
      : //           collection: PublicKey;
        //   creator: PublicKey; // the creator of the collection (close account rent gets sent here)
        //   collectionPermissions: PublicKey;
        [];
  }, [selectedCollectionKeys, collectionDict]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex" }} columnGap={2}>
        <Button
          onClick={() => setEditorStatus({ open: true, collection: undefined })}
        >
          Create Collection
        </Button>
        {deleteCollectionParams.length > 0 && (
          <DeleteCollectionTransactionButton
            params={deleteCollectionParams}
            formatting={{}}
          />
        )}

        <EditCollectionDialog
          open={editorStatus.open}
          onClose={() => {
            setEditorStatus({
              open: false,
              collection: undefined,
            });
          }}
        />
        <Button
          onClick={() => {
            refetch();
          }}
        >
          <RepeatIcon />
        </Button>
      </Box>
      {/* <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
        {isFetching && <Spinner />}
      </Box> */}
      <TableContainer sx={{ width: "100%" }}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th></Th>
              <Th></Th>
              <Th></Th>
              <Th></Th>

              <Th></Th>
              <Th colSpan={2}>
                <Center>Royalties</Center>
              </Th>

              <Th></Th>
            </Tr>
          </Thead>
          <Thead>
            <Tr>
              <Th>
                <Center>
                  <Checkbox
                    checked={selectAll}
                    onChange={(e) => {
                      toggleSelectAll(e.currentTarget.checked);
                    }}
                  />
                </Center>
              </Th>
              <Th>Collection</Th>
              <Th>Name</Th>
              <Th>Items</Th>

              <Th>Symbol</Th>
              <Th>bps</Th>
              <Th>
                <Center>Recipients</Center>
              </Th>
              <Th>
                  <Center>Signers</Center>
              </Th>
              <Th>
                  <Center>Attributes</Center>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {orderedCollections?.map((item, idx) => (
              <CollectionRow
                key={idx}
                permissions={permissionsByCollection[item.pubkey.toBase58()]}
                item={item}
                selectedCollections={selectedCollectionKeys}
                toggleSelectedCollection={toggleSelectedCollection}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
