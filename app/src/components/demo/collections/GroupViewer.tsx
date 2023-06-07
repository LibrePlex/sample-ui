import {
  Box,
  Center,
  Checkbox,
  Heading,
  ICollapse,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { IRpcObject } from "components/executor/IRpcObject";
import { Group } from "query/group";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

import { useConnection } from "@solana/wallet-adapter-react";
import { MetadataItem as MetadataItem } from "components/metadata/MetadataItem";
import { AddMetadataButton } from "./metadatadialog/AddMetadataButton";
import useSelectedMetadata from "./useSelectedMetadata";
import { Permissions } from "query/permissions";
import { DeleteMetadataButton } from "components/metadata/DeleteMetadataButton";
import {
  MetadataExtended,
  decodeMetadataExtended,
  useMetadataExtendedByGroup,
} from "query/metadataExtended";
import { Metadata } from "query/metadata";

export const GroupViewer = ({
  group,
  permissions,
  setCollection,
}: {
  permissions: IRpcObject<Permissions> | undefined;
  group: IRpcObject<Group> | undefined;
  setCollection: Dispatch<SetStateAction<IRpcObject<Group>>>;
}) => {
  const { connection } = useConnection();
  const { hydrated: items } = useMetadataExtendedByGroup(
    group?.pubkey,
    connection
  );

  const selectedMetadataKeys = useSelectedMetadata(
    (state) => state.selectedMetadataKeys
  );
  const toggleSelectedMetadata = useSelectedMetadata(
    (state) => state.toggleSelectedMetadataKey
  );

  const setSelectedMetadatakeys = useSelectedMetadata(
    (state) => state.setSelectedMetadataKeys
  );

  const [selectAll, setSelectAll] = useState<boolean>(false);

  const toggleSelectAll = useCallback(
    (_selectAll: boolean) => {
      setSelectedMetadatakeys(
        new Set(_selectAll ? items.map((item) => item.metadata.pubkey) : [])
      );
      setSelectAll(_selectAll);
    },
    [items, setSelectedMetadatakeys]
  );

  const metadataDict = useMemo(() => {
    const _metadataDict: {
      [key: string]: {
        metadata: IRpcObject<Metadata>;
        extended: IRpcObject<MetadataExtended>;
      };
    } = {};

    for (const metadata of items ?? []) {
      if (metadata) {
        _metadataDict[metadata?.metadata.pubkey?.toBase58()] = metadata;
      }
    }
    return _metadataDict;
  }, [items]);
  const [editorStatus, setEditorStatus] = useState<{
    open: boolean;
    collection: Group | undefined;
  }>({
    open: false,
    collection: undefined,
  });

  const deleteMetadataParams = useMemo(() => {
    return selectedMetadataKeys
      ? [...selectedMetadataKeys]
          .filter((item) => metadataDict[item.toBase58()])
          .map((pubkey) => ({
            collectionPermissions: permissions.pubkey,
            collection: group.pubkey,
            metadata: pubkey,
          }))
      : [];
  }, [group.pubkey, metadataDict, permissions.pubkey, selectedMetadataKeys]);

  return (
    <Box pt={5} sx={{ width: "100%", height: "100%" }}>
      <Box
        display="flex"
        alignItems="center"
        columnGap={3}
        sx={{ width: "100%" }}
      >
        <Heading>Items ({items?.length ?? "-"})</Heading>

        <AddMetadataButton size="sm" collection={group} />
        {deleteMetadataParams.length > 0 && (
          <DeleteMetadataButton params={deleteMetadataParams} formatting={{}} />
        )}
      </Box>
      <TableContainer
        sx={{
          maxHeight: "100vh",
          overflow: "auto",
          width: "100%",
          height: "100%",
        }}
      >
        <Table>
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
              <Th>Metadata</Th>
              <Th>Details</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items?.map((item, idx) => (
              <MetadataItem
                selectedMetadataKeys={selectedMetadataKeys}
                toggleSelectedMetadata={toggleSelectedMetadata}
                extended={item.extended}
                key={idx}
                item={item.metadata}
                collection={group}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
