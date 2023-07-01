import {
  Box,
  Center,
  Checkbox,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import { Group, IRpcObject, Metadata, useMetadataByGroup } from "shared-ui";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

import { useConnection } from "@solana/wallet-adapter-react";

import { AddMetadataButton } from "./metadatadialog/AddMetadataButton";
import useSelectedMetadata from "./useSelectedMetadata";

export const GroupViewer = ({
  group,
  setCollection,
}: {
  group: IRpcObject<Group> | undefined;
  setCollection: Dispatch<SetStateAction<IRpcObject<Group>>>;
}) => {
  const { connection } = useConnection();
  const { data: items } = useMetadataByGroup(
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
        new Set(_selectAll ? items.map((item) => item.pubkey) : [])
      );
      setSelectAll(_selectAll);
    },
    [items, setSelectedMetadatakeys]
  );

  const metadataDict = useMemo(() => {
    const _metadataDict: {
      [key: string]: IRpcObject<Metadata>;
    } = {};

    for (const metadata of items ?? []) {
      if (metadata) {
        _metadataDict[metadata?.pubkey?.toBase58()] = metadata;
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
        {/* TODO: ENABLE SELECTION BY METADATA EXTENSION */}
        {/* {deleteMetadataParams.length > 0 && (
          <DeleteMetadataExtensionButton params={deleteMetadataParams} formatting={{}} />
        )} */}
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
          {/* <Tbody>
            {items?.map((item, idx) => (
              <MetadataExtendedItem
                selectedMetadataKeys={selectedMetadataKeys}
                toggleSelectedMetadata={toggleSelectedMetadata}
                key={idx}
                item={item}
                collection={group}
              />
            ))}
          </Tbody> */}
        </Table>
      </TableContainer>
    </Box>
  );
};
