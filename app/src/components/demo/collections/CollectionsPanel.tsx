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
} from "@chakra-ui/react";
// import {
//     usePermissionsHydratedWithCollections
// } from "stores/accounts/useCollectionsById";

import { useCallback, useMemo, useState } from "react";
import { DeleteCollectionTransactionButton } from "./DeleteCollectionButton";

import { IRpcObject } from "components/executor/IRpcObject";
import { Group, decodeGroup } from "query/group";
import { GroupViewer } from "./GroupViewer";
import { EditGroupDialog } from "./editCollectionDialog/EditGroupDialog";
import { usePermittedCollections } from "./usePermittedCollections";
import useSelectedCollections from "./useSelectedCollections";
import { GroupRow } from "./GroupRow";

export const CollectionsPanel = () => {
  // const { publicKey } = useWallet();

  // const { connection } = useConnection();

  // const orderedCollections = useMemo(
  //   () =>
  //     collections
  //       ? [...collections].sort((a, b) =>
  //           a.item.name.localeCompare(b.item.name)
  //         )
  //       : [],
  //   [collections]
  // );

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

  const { groups, permissionsByCollection, refetch } =
    usePermittedCollections();

  const toggleSelectAll = useCallback(
    (_selectAll: boolean) => {
      setSelectedCollectionKeys(
        new Set(_selectAll ? groups.map((item) => item.pubkey) : [])
      );
      setSelectAll(_selectAll);
    },
    [groups, setSelectedCollectionKeys]
  );

  const collectionDict = useMemo(() => {
    const _collectionDict: {
      [key: string]: ReturnType<ReturnType<typeof decodeGroup>>;
    } = {};

    for (const collection of groups ?? []) {
      if (collection) {
        _collectionDict[collection?.pubkey?.toBase58()] = collection;
      }
    }
    return _collectionDict;
  }, [groups]);
  const [editorStatus, setEditorStatus] = useState<{
    open: boolean;
    collection: Group | undefined;
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
      : [];
  }, [selectedCollectionKeys, collectionDict, permissionsByCollection]);

  const [collection, setCollection] = useState<IRpcObject<Group>>();

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
          Create Group
        </Button>
        {deleteCollectionParams.length > 0 && (
          <DeleteCollectionTransactionButton
            params={deleteCollectionParams}
            formatting={{}}
          />
        )}

        <EditGroupDialog
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

      {collection ? (
        <Box display="flex" columnGap={3} alignItems="center">
          <Heading>Selected Collection : {collection.item.name}</Heading>
          <Button onClick={() => setCollection(undefined)}>Clear</Button>
        </Box>
      ) : (
        <Box>
          <Box pt={3} pb={3}>
            <Heading>Groups ({groups?.length ?? "-"})</Heading>
          </Box>
          <TableContainer
            sx={{ maxHeight: "100vh", overflow: "auto", width: "100%" }}
          >
            <Table variant="simple">
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
                  <Th>Image</Th>
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
                {groups?.map((item, idx) => (
                  <GroupRow
                    key={idx}
                    permissions={
                      permissionsByCollection[item.pubkey.toBase58()]
                    }
                    item={item}
                    selectedCollections={selectedCollectionKeys}
                    toggleSelectedCollection={toggleSelectedCollection}
                    activeCollection={collection}
                    setActiveCollection={setCollection}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {collection && (
        <GroupViewer
          permissions={permissionsByCollection[collection.pubkey.toBase58()]}
          group={collection}
          setCollection={setCollection}
        />
      )}
    </Box>
  );
};
