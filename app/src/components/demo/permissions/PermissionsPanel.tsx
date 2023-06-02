import { RepeatIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Checkbox,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import {
//     usePermissionsHydratedWithCollections
// } from "stores/accounts/useCollectionsById";

import { useCallback, useMemo, useState } from "react";

import { decodeCollectionPermission, usePermissionsByUser } from "query/permissions";
import { PermissionsRow } from "./PermissionsRow";
import useSelectedPermissions from "./useSelectedPermissions";
import { DeleteCollectionPermissionsTransactionButton } from "./DeleteCollectionPermissionsTransactionButton";
import { EditCollectionDialog } from "./EditPermissionDialog";
import { Collection } from "query/collections";

export const PermissionsPanel = () => {
  const { publicKey } = useWallet();

  const { connection } = useConnection();

  const selectedPermissionKeys = useSelectedPermissions(
    (state) => state.selectedPermissionKeys
  );
  const toggleSelectedPermission = useSelectedPermissions(
    (state) => state.toggleSelectedPermission
  );

  const setSelectedPermissionKeys = useSelectedPermissions(
    (state) => state.setSelectedPermissionKeys
  );

  const {
    data: permissions,
    isFetching,
    refetch,
  } = usePermissionsByUser(publicKey, connection);

  const [selectAll, setSelectAll] = useState<boolean>(false);

  const toggleSelectAll = useCallback(
    (_selectAll: boolean) => {
      console.log(_selectAll, permissions);
      setSelectedPermissionKeys(
        new Set(_selectAll ? permissions.map((item) => item.pubkey) : [])
      );
      setSelectAll(_selectAll);
    },
    [permissions]
  );

  const [editorStatus, setEditorStatus] = useState<{
    open: boolean;
    collection: Collection | undefined;
  }>({
    open: false,
    collection: undefined,
  });


  const permissionDict = useMemo(() => {
    const _permissionDict: {
      [key: string]: ReturnType<ReturnType<typeof decodeCollectionPermission>>;
    } = {};

    for (const permission of permissions ?? []) {
      if (permission) {
        _permissionDict[permission?.pubkey?.toBase58()] = permission;
      }
    }
    return _permissionDict;
  }, [permissions]);

 

  const deleteSelectionParams = useMemo(() => {
    console.log({ selectedPermissionKeys });
    return selectedPermissionKeys
      ? [...selectedPermissionKeys]
          .filter((item) => permissionDict[item.toBase58()])
          .map((pubkey) => ({
            collectionPermissions: pubkey,
            collection: permissionDict[pubkey.toBase58()].item.collection,
          }))
      : [];
  }, [selectedPermissionKeys, permissionDict]);


  return (
    <Box sx={{ maxHeight: "50vh", overflow: "auto", width: "100%" }}>
      {/* <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "start",
        }}
      >
        <Button
        // onClick={() =>
        //   setEditorStatus({ open: true, collection: undefined })
        // }
        >
          Create Permission
        </Button>
        {selectedPermissionKeys.size > 0 && (
          <DeleteCollectionPermissionsTransactionButton
            params={deleteSelectionParams}
            formatting={{}}
          />
        )}
      </Box> */}

      <EditCollectionDialog
        open={editorStatus.open}
        onClose={() => {
          setEditorStatus({
            open: false,
            collection: undefined,
          });
        }}
      />
      <Box p={2}>
        <Text>
          In LibrePlex, permissions can be allocated at collection level or mint
          level. It is expected that in most cases allocating a single set of
          permissions / delegates at collection level is sufficient (must like
          update authority in the legacy standard).
        </Text>

        <Text>
          For finer grain control, there are mint-level overrides built into the
          standard in case you need to set specific permissions for particular
          assets in a collection.
        </Text>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {isFetching && <Spinner />}
      </Box>
      <TableContainer>
        <Table variant="simple">
          {/* <TableCaption>Your permissions</TableCaption> */}

          <Thead>
            <Tr>
              <Th colSpan={2}></Th>
              <Th></Th>
              <Th colSpan={3}>
                <Center>Metadata</Center>
              </Th>
              <Th colSpan={3}>
                <Center>Collection</Center>
              </Th>
              <Th colSpan={2}></Th>
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
                      // setSelectAll((old) => !old);
                      // if (e) {
                      //   setSelectedPermissions(
                      //     (old) => new Set([...old].filter((item) => item))
                      //   );
                      // } else {
                      //   setSelectedPermissions(
                      //     (old) =>
                      //       new Set([...old].filter((x) => x != item.pubkey))
                      //   );
                      // }
                    }}
                  />
                </Center>
              </Th>
              <Th>Permission</Th>
              <Th>IsAdmin</Th>
              <Th>Create</Th>
              <Th>Edit </Th>
              <Th>Delete</Th>
              <Th>Address</Th>
              <Th>Edit</Th>
              <Th>Delete</Th>
              <Th>
                <Button
                  onClick={() => {
                    refetch();
                  }}
                >
                  <RepeatIcon />
                </Button>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {permissions?.map((item, idx) => (
              <PermissionsRow
                item={item}
                key={idx}
                selectedPermissions={selectedPermissionKeys}
                toggleSelectedPermission={toggleSelectedPermission}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
