import { RepeatIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Spinner,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { CopyPublicKeyButton } from "components/buttons/CopyPublicKeyButton";
import {
    usePermissionsHydratedWithCollections
} from "stores/accounts/useCollectionsById";
import { usePermissionsByAuthority } from "stores/accounts/usePermissionsByAuthority";
import { DeleteCollectionTransactionButton } from "./DeleteCollectionButton";

export const CollectionsPanel = () => {
  const { publicKey } = useWallet();

  //   const {
  //     getCollectionsByAuthority,
  //     collections,
  //     isFetching,
  //     clearCollections,
  //   } = useCollectionsByAuthority();

  const { connection } = useConnection();

  const {
    items: permissions,
  } = usePermissionsByAuthority(publicKey, connection);

  const {
    items: collections,
    removeCollection,
    isFetching,
    clear,
  } = usePermissionsHydratedWithCollections(permissions, connection);


  return (
    <Box>
      <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
        {isFetching && <Spinner />}
      </Box>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Your collections</TableCaption>
          <Thead>
            <Tr>
              <Th>Collection</Th>
              <Th>Name</Th>
              <Th isNumeric>Items</Th>
              <Th isNumeric>Symbol</Th>
              <Th>
                <Button
                  onClick={() => {
                    clear();
                  }}
                >
                  <RepeatIcon />
                </Button>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {collections?.map((item, idx) => (
              <Tr key={idx}>
                <Td>
                  <CopyPublicKeyButton
                    publicKey={item.collection.pubkey.toBase58()}
                  />
                </Td>
                <Td>{item.collection.item.name}</Td>
                <Td isNumeric>{item.collection.item.itemCount.toString()}</Td>
                <Td isNumeric>{item.collection.item.symbol}</Td>
                <Td isNumeric>
                  {Number(item.collection.item.itemCount.toString()) === 0 && (
                    <DeleteCollectionTransactionButton
                      onSuccess={() => {}}
                      params={{
                        collection: item.collection.pubkey,
                        collectionPermissions: item.permissions.pubkey,
                      }}
                      formatting={{ size: "sm", colorScheme: "teal" }}
                    />
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
