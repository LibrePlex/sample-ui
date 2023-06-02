import { Td, Tr, Text, Center, Checkbox } from "@chakra-ui/react";
import { CopyPublicKeyButton } from "components/buttons/CopyPublicKeyButton";
import { IRpcObject } from "components/executor/IRpcObject";
import { CollectionPermissions } from "query/permissions";

import { Collection } from "query/collections";
import useDeletedKeysStore from "stores/useDeletedKeyStore";
import { DeleteCollectionTransactionButton } from "./DeleteCollectionButton";
import { PublicKey } from "@solana/web3.js";

export const CollectionRow = ({
  item,
  permissions,
  selectedCollections,
  toggleSelectedCollection,
}: {
  permissions: IRpcObject<CollectionPermissions> | undefined;
  item: IRpcObject<Collection>;
  selectedCollections: Set<PublicKey>;
  toggleSelectedCollection: (pubkey: PublicKey, b: boolean) => any;
}) => {
  const deletedKeys = useDeletedKeysStore((state) => state.deletedKeys);
  return (
    <Tr
      sx={{
        background: deletedKeys.has(item.pubkey) ? "#fee" : "none",
      }}
    >
      <Td>
        <Center>

          <Checkbox
            isChecked={selectedCollections.has(item.pubkey)}
            onChange={(e) => {
              toggleSelectedCollection(item.pubkey, e.currentTarget.checked);
            }}
          />
        </Center>
      </Td>
      <Td>
        <CopyPublicKeyButton publicKey={item.pubkey.toBase58()} />
      </Td>
      <Td>{item.item.name}</Td>
      <Td isNumeric>{item.item.itemCount.toString()}</Td>
      <Td isNumeric>{item.item.symbol}</Td>
      <Td isNumeric>
        {item &&
          permissions &&
          Number(item.item.itemCount.toString()) === 0 &&
          (deletedKeys.has(item.pubkey) ? (
            <Text>Deleted</Text>
          ) : (
            <></>
          ))}
      </Td>
    </Tr>
  );
};
