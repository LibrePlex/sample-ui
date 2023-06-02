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

import { useMemo } from "react";
import { DeleteCollectionTransactionButton } from "./DeleteCollectionButton";

import { IRpcObject } from "components/executor/IRpcObject";
import { CollectionPermissions } from "generated/libreplex";
import { useQuery } from "react-query";
import { useCollectionsById } from "query/useCollectionsById";
import { usePermissions } from "query/permissions";
import useDeletedKeysStore from "stores/useDeletedKeyStore";

export const CollectionsPanel = () => {
  const { publicKey } = useWallet();

  const { connection } = useConnection();

  const { data: permissions, refetch } = usePermissions(publicKey, connection);

  const distinctCollectionKeys = useMemo(
    () => [
      ...new Set<PublicKey>(
        permissions
          ?.filter((item) => item.item)
          .map((item) => item.item.collection) ?? []
      ),
    ],
    [permissions]
  );

  const permissionsByCollection = useMemo(() => {
    const _permissionsByCollection: {
      [key: string]: IRpcObject<CollectionPermissions>;
    } = {};

    for (const permission of permissions ?? []) {
      _permissionsByCollection[permission.item.collection.toBase58()] = {
        pubkey: permission.pubkey,
        item: permission.item,
      };
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

  const deletedKeys = useDeletedKeysStore((state) => state.deletedKeys);

  return (
    <Box>
      <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
        {isFetching && <Spinner />}
      </Box>
      {/* {permissions.length} */}
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
                    refetch();
                  }}
                >
                  <RepeatIcon />
                </Button>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {orderedCollections?.map((item, idx) => (
              <Tr
                key={idx}
                sx={{
                  background: deletedKeys.has(item.pubkey) ? "#fee" : "none",
                }}
              >
                <Td>
                  <CopyPublicKeyButton publicKey={item.pubkey.toBase58()} />
                </Td>
                <Td>{item.item.name}</Td>
                <Td isNumeric>{item.item.itemCount.toString()}</Td>
                <Td isNumeric>{item.item.symbol}</Td>
                <Td isNumeric>
                  {item &&
                    permissionsByCollection &&
                    permissionsByCollection[item.pubkey.toBase58()] &&
                    Number(item.item.itemCount.toString()) === 0 &&
                    (deletedKeys.has(item.pubkey) ? (
                      <Text>Deleted</Text>
                    ) : (
                      <DeleteCollectionTransactionButton
                        params={{
                          collection: item.pubkey,
                          creator: item.item.creator,
                          collectionPermissions:
                            permissionsByCollection[item.pubkey.toBase58()]
                              .pubkey,
                        }}
                        formatting={{ size: "sm", colorScheme: "teal" }}
                      />
                    ))}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
