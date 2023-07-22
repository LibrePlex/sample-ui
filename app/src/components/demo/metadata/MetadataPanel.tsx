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

import { useCallback, useContext, useMemo, useState } from "react";

import { Group, IRpcObject, MetadataProgramContext } from "shared-ui";
import { Metadata } from "shared-ui";
import useSelectedMetadata from "../collections/useSelectedMetadata";
import { CreateMetadataDialog } from "./CreateMetadataDialog";
import { MetadataRow } from "./MetadataRow";
import { DeleteMetadataButton } from "@/components/metadata/DeleteMetadataButton";
import { useMetadataByAuthority } from "shared-ui";

export const BaseMetadataPanel = () => {
  const { publicKey } = useWallet();

  const { connection } = useConnection();

  const { data: metadataUnordered, refetch } = useMetadataByAuthority(
    publicKey,
    connection
  );

  const metadata = useMemo(
    () =>
      [...metadataUnordered].sort((a, b) =>
        a.pubkey.toBase58().localeCompare(b.pubkey.toBase58())
      ),
    [metadataUnordered]
  );

  const metadataDict = useMemo(() => {
    const _metadataDict: { [key: string]: IRpcObject<Metadata> } = {};
    for (const m of metadata) {
      _metadataDict[m.pubkey.toBase58()] = m;
    }
    return _metadataDict;
  }, [metadata]);

  const selectedMetadataKeys = useSelectedMetadata(
    (state) => state?.selectedMetadataKeys
  );
  const toggleSelectedMetadata = useSelectedMetadata(
    (state) => state?.toggleSelectedMetadataKey
  );

  const setSelectedMetadataKeys = useSelectedMetadata(
    (state) => state?.setSelectedMetadataKeys
  );

  const [selectAll, setSelectAll] = useState<boolean>(false);

  const toggleSelectAll = useCallback(
    (_selectAll: boolean) => {
      setSelectedMetadataKeys(
        new Set(_selectAll ? metadata.map((item) => item.pubkey.toBase58()) : [])
      );
      setSelectAll(_selectAll);
    },
    [metadata, setSelectedMetadataKeys]
  );
  const [editorStatus, setEditorStatus] = useState<{
    open: boolean;
    collection: Group | undefined;
  }>({
    open: false,
    collection: undefined,
  });

  const [activeMetadata, setActiveMetadata] = useState<IRpcObject<Metadata>>();

  const { program } = useContext(MetadataProgramContext);

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
        {selectedMetadataKeys?.size > 0 && (
          <DeleteMetadataButton
            params={{
              metadataObjects: [...selectedMetadataKeys].map(
                (item) => metadataDict[item]
              ),
              metadataProgramId: program.programId,
            }}
            formatting={{}}
          />
        )}
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
        <Box sx={{ maxWidth: "100%", maxHeight: "100%" }}>
          <Box pt={3} pb={3}>
            <Heading>Metadata ({metadata?.length ?? "-"})</Heading>
          </Box>
          <TableContainer
            sx={{
              overflow: "auto",
              width: "100%",
              maxHeight: "50vh",
              overflowY: "auto",
            }}
          >
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th colSpan={5}></Th>
                  <Th colSpan={4}></Th>
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

                  <Th>Asset</Th>
                  <Th>Group</Th>

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
                {metadata?.map((item, idx) => (
                  <MetadataRow
                    key={idx}
                    item={item}
                    selectedMetadataObjs={selectedMetadataKeys}
                    toggleSelectedMetadata={toggleSelectedMetadata}
                    activeMetadata={activeMetadata}
                    setActiveMetadata={setActiveMetadata}
                  />
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
