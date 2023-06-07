import { RepeatIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Checkbox,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  Text
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import {
//     usePermissionsHydratedWithCollections
// } from "stores/accounts/useCollectionsById";
import { PublicKey } from "@solana/web3.js";

import { useCallback, useMemo, useState } from "react";

import { IRpcObject } from "components/executor/IRpcObject";
import { Group } from "query/group";
import { Metadata, decodeMetadata, useMetadataById } from "query/metadata";
import { Permissions, usePermissionsByUser } from "query/permissions";
import useSelectedCollections from "../collections/useSelectedCollections";
import { CreateMetadataDialog } from "./CreateMetadataDialog";
import { MetadataRow } from "./MetadataRow";
import useSelectedMetadata from "../collections/useSelectedMetadata";
import { getMetadataExtendedPda } from "pdas/getMetadataExtendedPda";
import {
  MetadataExtended,
  useMetadataExtendedById,
} from "query/metadataExtended";
import { useMetadataHydratedWithExtended } from "./useHydratedMetadata";

export const BaseMetadataPanel = () => {
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

  const distinctReferenceKeys = useMemo(
    () => [
      ...new Set<PublicKey>([
        ...(permissions
          ?.filter((item) => item.item)
          .map((item) => item.item.reference) ?? []),
      ]),
    ],
    [
      permissions,
      // , createdCollections
    ]
  );

  const permissionsByMetadata = useMemo(() => {
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

  const selectedMetadataKeys = useSelectedMetadata(
    (state) => state.selectedMetadataKeys
  );
  const toggleSelectedMetadata = useSelectedMetadata(
    (state) => state.toggleSelectedMetadataKey
  );

  const setSelectedMetadataKeys = useSelectedMetadata(
    (state) => state.setSelectedMetadataKeys
  );

  const [selectAll, setSelectAll] = useState<boolean>(false);

  const { hydrated } = useMetadataHydratedWithExtended(distinctReferenceKeys);

  const toggleSelectAll = useCallback(
    (_selectAll: boolean) => {
      setSelectedMetadataKeys(
        new Set(_selectAll ? hydrated.map((item) => item.metadata.pubkey) : [])
      );
      setSelectAll(_selectAll);
    },
    [hydrated, setSelectedMetadataKeys]
  );

  // const metadataDict = useMemo(() => {
  //   const _metadataDict: {
  //     [key: string]: ReturnType<ReturnType<typeof decodeMetadata>>;
  //   } = {};

  //   for (const metadataObj of metadataObjs ?? []) {
  //     if (metadataObj) {
  //       _metadataDict[metadataObj?.pubkey?.toBase58()] = metadataObj;
  //     }
  //   }
  //   return _metadataDict;
  // }, [metadataObjs]);
  const [editorStatus, setEditorStatus] = useState<{
    open: boolean;
    collection: Group | undefined;
  }>({
    open: false,
    collection: undefined,
  });

  // const deleteMetadataParams = useMemo(() => {
  //   return selectedMetadataKeys
  //     ? [...selectedMetadataKeys]
  //         .filter((item) => metadataDict[item.toBase58()])
  //         .map((pubkey) => ({
  //           creator: metadataDict[pubkey.toBase58()].item.creator,
  //           collectionPermissions:
  //             permissionsByMetadata[pubkey.toBase58()].pubkey,
  //           collection: pubkey,
  //         }))
  //     : [];
  // }, [selectedMetadataKeys, metadataDict, permissionsByMetadata]);

  const [activeMetadata, setActiveMetadata] = useState<IRpcObject<Metadata>>();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        justifyContent: "start",
        alignItems: "start",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "start",
          justifyContent: "center",
          width: "100%",
        }}
        columnGap={2}
      >
        <Button
          onClick={() => setEditorStatus({ open: true, collection: undefined })}
        >
          Create Metadata
        </Button>

        <CreateMetadataDialog
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

      {selectedMetadataKeys && activeMetadata ? (
        <Box display="flex" columnGap={3} alignItems="center">
          <Heading>Selected Collection : {activeMetadata.item.name}</Heading>
          <Button onClick={() => setActiveMetadata(undefined)}>Clear</Button>
        </Box>
      ) : (
        <Box sx={{ maxWidth: "100%", maxHeight :"100%"}}>
          <Box pt={3} pb={3}>
            <Heading>Metadata ({hydrated?.length ?? "-"})</Heading>
          </Box>
          <TableContainer
            sx={{ overflow: "auto", width: "100%", maxHeight :"50vh", overflowY: 'auto'  }}
          >
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th colSpan={3}></Th>
                  <Th colSpan={4}>
                    <Center>Extended</Center>
                  </Th>
                </Tr>

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
                  <Th>Image</Th>
                  <Th>
                    <Center>Data</Center>
                  </Th>
                  <Th>Collection</Th>

                  <Th>Royalties</Th>
                  <Th>
                    <Center>Signers</Center>
                  </Th>
                  <Th>
                    <Center>Attributes</Center>
                  </Th>
                </Tr>
              </Thead>

              <Tbody>
                {hydrated?.map((item, idx) => (
                  <MetadataRow
                    key={idx}
                    group={item.group}
                    permissions={permissionsByMetadata[item.metadata.pubkey.toBase58()]}
                    item={item.metadata}
                    metadataExtended={item.extended}
                    selectedMetadataObjs={selectedMetadataKeys}
                    toggleSelectedMetadata={toggleSelectedMetadata}
                    activeMetadata={activeMetadata}
                    setActiveMetadata={setActiveMetadata}/>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* {collection && (
        <CollectionViewer
          permissions={permissionsByCollection[collection.pubkey.toBase58()]}
          collection={collection}
          setCollection={setCollection}
        />
      )} */}
    </Box>
  );
};
